function Employees() {
    this.arr = [];

    this.addEmployee = function (employee) {
        this.arr.push(employee);
    };
    this.removeEmployee = function (employeeId) {
        const index = this.arr.findIndex(employee => employee.id === employeeId);

        if (index !== -1) {
            this.arr.splice(index, 1);
        }
    };
    this.editEmployee = function (employeeId) {
        return this.arr.find(employee => employee.id === employeeId);
    };
    this.updateEmployee = function (updatedEmployee) {
        const index = this.arr.findIndex(employee => employee.id === updatedEmployee.id);

        if (index !== -1) {
            this.arr[index] = updatedEmployee;
        }
    };
    this.getEmployeesByType = function (keyword) {
        return this.arr.filter(employee => employee.employeeType.toLowerCase().includes(keyword.toLowerCase()));
    };
}
