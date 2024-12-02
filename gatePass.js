const fs = require('fs');
const readline = require('readline-sync');

// Utility functions to handle file operations
const loadData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return data ? JSON.parse(data) : {};
    } catch (err) {
        return {};
    }
};

const saveData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
};

// Classes for entities
class Student {
    constructor(rollNumber, name, password, className) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.password = password;
        this.className = className;
    }
}

class GatePass {
    constructor(rollNumber, name, className, reason) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.className = className;
        this.reason = reason;
        this.status = "Pending";
    }
}

// Main GatePassManager class
class GatePassManager {
    constructor() {
        this.students = loadData('students.json');
        this.gatePassRequests = loadData('gate_pass_requests.json');
        this.admins = loadData('admins.json');
    }

    saveData() {
        saveData('students.json', this.students);
        saveData('gate_pass_requests.json', this.gatePassRequests);
        saveData('admins.json', this.admins);
    }

    registerStudent(rollNumber, name, password, className) {
        if (this.students[rollNumber]) return false;
        this.students[rollNumber] = { name, password, class: className };
        this.saveData();
        return true;
    }

    loginStudent(rollNumber, password) {
        const student = this.students[rollNumber];
        if (student && student.password === password) {
            return student;
        }
        return null;
    }

    applyGatePass(rollNumber, reason) {
        const student = this.students[rollNumber];
        if (student) {
            const gatePass = new GatePass(
                rollNumber,
                student.name,
                student.class,
                reason
            );
            this.gatePassRequests.push(gatePass);
            this.saveData();
            return true;
        }
        return false;
    }

    getGatePassStatus(rollNumber) {
        return this.gatePassRequests.filter(
            (request) => request.rollNumber === rollNumber
        );
    }

    withdrawGatePass(rollNumber) {
        const index = this.gatePassRequests.findIndex(
            (request) => request.rollNumber === rollNumber
        );
        if (index > -1) {
            this.gatePassRequests.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    registerAdmin(username, password) {
        if (this.admins[username]) return false;
        this.admins[username] = password;
        this.saveData();
        return true;
    }

    loginAdmin(username, password) {
        return this.admins[username] === password;
    }

    approveGatePass(rollNumber) {
        const request = this.gatePassRequests.find(
            (req) => req.rollNumber === rollNumber
        );
        if (request) {
            request.status = "Approved";
            this.saveData();
            return true;
        }
        return false;
    }

    rejectGatePass(rollNumber) {
        const request = this.gatePassRequests.find(
            (req) => req.rollNumber === rollNumber
        );
        if (request) {
            request.status = "Rejected";
            this.saveData();
            return true;
        }
        return false;
    }
}

// Command-line interface
function main() {
    const manager = new GatePassManager();

    while (true) {
        console.log("\nOptions:");
        console.log("1. Register Student");
        console.log("2. Login Student");
        console.log("3. Search for Gate Pass");
        console.log("4. Register Admin");
        console.log("5. Login Admin");
        console.log("6. Exit");
        const choice = readline.question("Choose an option: ");

        if (choice === '1') {
            const rollNumber = readline.question("Enter roll number: ");
            const name = readline.question("Enter name: ");
            const password = readline.question("Enter password: ");
            const className = readline.question("Enter class: ");
            if (manager.registerStudent(rollNumber, name, password, className)) {
                console.log("Registration successful!");
            } else {
                console.log("Roll number already exists.");
            }
        } else if (choice === '2') {
            const rollNumber = readline.question("Enter roll number: ");
            const password = readline.question("Enter password: ");
            const student = manager.loginStudent(rollNumber, password);
            if (student) {
                console.log(`Welcome ${student.name}! You are in class ${student.class}.`);
                while (true) {
                    console.log("\nOptions:");
                    console.log("1. Apply for Gate Pass");
                    console.log("2. Check Gate Pass Status");
                    console.log("3. Withdraw Gate Pass");
                    console.log("4. Logout");
                    const subChoice = readline.question("Choose an option: ");

                    if (subChoice === '1') {
                        const reason = readline.question("Enter reason for Gate Pass: ");
                        if (manager.applyGatePass(rollNumber, reason)) {
                            console.log("Gate pass request submitted.");
                        } else {
                            console.log("Failed to submit request.");
                        }
                    } else if (subChoice === '2') {
                        const statuses = manager.getGatePassStatus(rollNumber);
                        if (statuses.length) {
                            statuses.forEach((status) => {
                                console.log(`Gate Pass for ${status.reason}: ${status.status}`);
                            });
                        } else {
                            console.log("No gate pass requests found.");
                        }
                    } else if (subChoice === '3') {
                        if (manager.withdrawGatePass(rollNumber)) {
                            console.log("Gate pass withdrawn.");
                        } else {
                            console.log("No gate pass found to withdraw.");
                        }
                    } else if (subChoice === '4') {
                        console.log("Logged out.");
                        break;
                    } else {
                        console.log("Invalid option.");
                    }
                }
            } else {
                console.log("Invalid roll number or password.");
            }
        } else if (choice === '3') {
            const rollNumber = readline.question("Enter roll number to search: ");
            const statuses = manager.getGatePassStatus(rollNumber);
            if (statuses.length) {
                statuses.forEach((status) => {
                    console.log(`Gate Pass for ${status.reason}: ${status.status}`);
                });
            } else {
                console.log("No gate pass requests found.");
            }
        } else if (choice === '4') {
            const username = readline.question("Enter admin username: ");
            const password = readline.question("Enter admin password: ");
            if (manager.registerAdmin(username, password)) {
                console.log("Admin registration successful!");
            } else {
                console.log("Admin username already exists.");
            }
        } else if (choice === '5') {
            const username = readline.question("Enter admin username: ");
            const password = readline.question("Enter admin password: ");
            if (manager.loginAdmin(username, password)) {
                console.log(`Welcome Admin ${username}!`);
                while (true) {
                    console.log("\nOptions:");
                    console.log("1. View All Gate Passes");
                    console.log("2. Approve Gate Pass");
                    console.log("3. Reject Gate Pass");
                    console.log("4. Logout");
                    const adminChoice = readline.question("Choose an option: ");

                    if (adminChoice === '1') {
                        manager.gatePassRequests.forEach((request) => {
                            console.log(
                                `${request.name} (${request.rollNumber}): ${request.reason} - ${request.status}`
                            );
                        });
                    } else if (adminChoice === '2') {
                        const rollNumber = readline.question("Enter roll number to approve: ");
                        if (manager.approveGatePass(rollNumber)) {
                            console.log("Gate pass approved.");
                        } else {
                            console.log("Failed to approve gate pass.");
                        }
                    } else if (adminChoice === '3') {
                        const rollNumber = readline.question("Enter roll number to reject: ");
                        if (manager.rejectGatePass(rollNumber)) {
                            console.log("Gate pass rejected.");
                        } else {
                            console.log("Failed to reject gate pass.");
                        }
                    } else if (adminChoice === '4') {
                        console.log("Logged out.");
                        break;
                    } else {
                        console.log("Invalid option.");
                    }
                }
            } else {
                console.log("Invalid admin username or password.");
            }
        } else if (choice === '6') {
            console.log("Exiting the program.");
            break;
        } else {
            console.log("Invalid option.");
        }
    }
}

// Start the program
main();
