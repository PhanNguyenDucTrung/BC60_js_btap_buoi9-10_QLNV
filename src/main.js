//////////////////////////////////////
// Helper Function
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

const getEl = id => {
    return document.getElementById(id);
};

//////////////////////////////////////
const employees = new Employees();
const validation = new Validation();
getLocalStorage();

////////////////////////////////////////
function createEmployee(employeeId = null) {
    // Get user input from the form
    const account = getEl('account').value;
    const fullName = getEl('fullName').value;
    const email = getEl('email').value;
    const password = getEl('password').value;
    const workDate = getEl('workDate').value;
    const basicSalary = getEl('basicSalary').value;
    const position = getEl('position').value;
    const workHours = getEl('workHours').value;
    const id = employeeId || nanoid(10);

    // Validation
    let isValid = true;

    isValid &=
        validation.emptyCheck(account, 'tbTKNV', 'Vui lòng nhập tên tài khoản.') &&
        validation.stringLengthCheck(account, 'tbTKNV', 'Nhập tài khoản 4-6 ký tự', 4, 6);
    console.log('kiem tra ten tai khoan', isValid);

    isValid &=
        validation.emptyCheck(fullName, 'tbTen', 'Vui lòng nhập họ tên.') &&
        validation.allLetterCheck(fullName, 'tbTen', 'Tên không hợp lệ.');
    console.log('kiem tra ten ', isValid);

    isValid &=
        validation.emptyCheck(email, 'tbEmail', 'Vui lòng nhập email') &&
        validation.emailFormatCheck(email, 'tbEmail', 'Email không hợp lệ');
    console.log('kiem tra email', isValid);

    isValid &= validation.emptyCheck(password, 'tbMatKhau', 'Vui lòng nhập mật khẩu');
    console.log('mat khau', isValid);

    isValid &=
        validation.emptyCheck(workDate, 'tbNgay', 'Vui lòng nhập ngày') &&
        validation.dateFormatCheck(workDate, 'tbNgay', 'Ngày không hợp lệ');

    isValid &= validation.emptyCheck(basicSalary, 'tbLuongCB', 'Vui lòng nhập lương cơ bản');

    isValid &= validation.positionCheck('tbChucVu', 'Vui lòng chọn chức vụ');

    isValid &=
        validation.emptyCheck(workHours, 'tbGioLam', 'Vui lòng nhập số giờ làm') &&
        validation.allNumberCheck(workHours, 'tbGioLam', 'Vui lòng nhập số!') &&
        validation.workHoursCheck(workHours, 'tbGioLam', 'Số giờ làm không hợp lệ');

    document.querySelectorAll('.sp-thongbao').forEach(span => {
        if (span.innerHTML.trim() !== '') {
            span.style.display = 'block';
        }
    });

    console.log(isValid);
    if (!isValid) return;

    const employee = new Employee(id, account, fullName, email, password, workDate, basicSalary, position, workHours);

    // Print the employee object to console (for testing purposes)
    console.log(employee);
    return employee;
}

function handleDelete(employeeId) {
    employees.removeEmployee(employeeId);

    setLocalStorage();

    renderUI(employees.arr);
}

function handleEdit(employeeId) {
    const selectedEmployee = employees.editEmployee(employeeId);
    console.log(selectedEmployee);
    getEl('account').value = selectedEmployee.account;
    getEl('fullName').value = selectedEmployee.fullName;
    getEl('email').value = selectedEmployee.email;
    getEl('password').value = selectedEmployee.password;
    getEl('workDate').value = selectedEmployee.workDate;
    getEl('basicSalary').value = selectedEmployee.basicSalary;
    getEl('position').value = selectedEmployee.position;
    getEl('workHours').value = selectedEmployee.workHours;

    getEl('btnAddEmployee').style.display = 'none';
    getEl('btnUpdate').style.display = 'inline-block';

    getEl('btnUpdate').onclick = function () {
        handleUpdate(employeeId);
    };
}

function handleUpdate(employeeId) {
    const updatedEmployee = createEmployee(employeeId);

    if (!updatedEmployee) return;

    employees.updateEmployee(updatedEmployee);

    setLocalStorage();

    renderUI(employees.arr);

    getEl('btnUpdate').style.display = 'none';
    getEl('btnAddEmployee').style.display = 'inline-block';
}

function renderUI(data) {
    let content = '';
    data.forEach(employee => {
        content += `
        <tr>
            <td>${employee.account}</td>
            <td>${employee.fullName}</td>
            <td>${employee.email}</td>
            <td>${employee.workDate}</td>
            <td>${employee.position}</td>
            <td>${employee.totalSalary}</td>
            <td>${employee.employeeType}</td>
            <td>
                <button class='btn btn-danger delete-btn' data-id="${employee.id}">delete</button>
            </td>
            <td>
                <button class='btn btn-success edit-btn' data-id="${employee.id}">edit</button>
            </td>
        </tr>
        `;
    });

    getEl('tableDanhSach').innerHTML = content;

    getEl('tableDanhSach').addEventListener('click', event => {
        const target = event.target;

        // Check if the clicked element is a delete button
        if (target.classList.contains('delete-btn')) {
            const employeeId = target.dataset.id;
            handleDelete(employeeId);
        }

        // Check if the clicked element is an edit button
        if (target.classList.contains('edit-btn')) {
            target.setAttribute('data-toggle', 'modal');
            target.setAttribute('data-target', '#myModal');
            const employeeId = target.dataset.id;
            handleEdit(employeeId);
        }
    });
}

// Events
getEl('btnAddEmployee').addEventListener('click', () => {
    const employee = createEmployee();

    if (!employee) return;
    employees.addEmployee(employee);

    setLocalStorage();

    renderUI(employees.arr);
});

// Tìm nhân viên
getEl('searchName').addEventListener('input', function () {
    const keyword = this.value;

    const employeesOfSelectedType = employees.getEmployeesByType(keyword);

    if (employeesOfSelectedType.length == 0) {
        renderUI(employees.arr);
        return;
    }
    renderUI(employeesOfSelectedType);
});

function setLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees.arr));
}

function getLocalStorage() {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        // Parse the stored string back into an array
        employees.arr = JSON.parse(storedEmployees);
        // Render the UI with the loaded data
        renderUI(employees.arr);
    }
}

// (function () {
//     'use strict';
//     window.addEventListener(
//         'load',
//         function () {
//             // Fetch all the forms we want to apply custom Bootstrap validation styles to
//             var forms = document.getElementsByClassName('needs-validation');
//             // Loop over them and prevent submission
//             var validation = Array.prototype.filter.call(forms, function (form) {
//                 form.addEventListener(
//                     'submit',
//                     function (event) {
//                         if (form.checkValidity() === false) {
//                             event.preventDefault();
//                             event.stopPropagation();
//                         }
//                         form.classList.add('was-validated');
//                     },
//                     false
//                 );
//             });
//         },
//         false
//     );
// })();
