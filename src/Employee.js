function Employee(id, account, fullName, email, password, workDate, basicSalary, position, workHours) {
    // Properties
    this.id = id;
    this.account = account;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.workDate = workDate;
    this.basicSalary = basicSalary || 0;
    this.position = position;
    this.workHours = workHours || 0;
    this.totalSalary = 0;
    this.employeeType = '';

    // Classify employee based on work hours
    if (this.workHours >= 192) {
        this.employeeType = 'Xuất Sắc';
    } else if (this.workHours >= 176) {
        this.employeeType = 'Giỏi';
    } else if (this.workHours >= 160) {
        this.employeeType = 'Khá';
    } else {
        this.employeeType = 'Trung Bình';
    }
    // Calculate total base on position
    switch (this.position) {
        case 'Sếp':
            this.totalSalary = this.basicSalary * 3;
            break;
        case 'Trưởng phòng':
            this.totalSalary = this.basicSalary * 2;
            break;
        case 'Nhân viên':
            this.totalSalary = this.basicSalary;
            break;
        default:
            this.totalSalary = 0;
    }
}
