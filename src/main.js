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

// default state: isEditing = false
let isEditing = false;
/**
 * Logic:
 * CLick edit button => set isEditing = true
 * Click update button => set isEditing = false
 * Nếu isEditing = true => Click btnAddEmployeeOpen => clearField() và set isEditing = false
 */

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

    if (!employeeId) {
        isValid &=
            validation.emptyCheck(account, 'tbTKNV', 'Vui lòng nhập tên tài khoản.') &&
            validation.allNumberCheck(account, 'tbTKNV', 'Tài khoản không hợp lệ, vui lòng nhập số') &&
            validation.stringLengthCheck(account, 'tbTKNV', 'Nhập tài khoản 4-6 ký số', 4, 6) &&
            validation.existingAccountCheck(account, employees.arr, 'tbTKNV', 'Tài khoản đã tồn tại');
    }

    isValid &=
        validation.emptyCheck(fullName, 'tbTen', 'Vui lòng nhập họ tên.') &&
        validation.allLetterCheck(fullName, 'tbTen', 'Tên không hợp lệ.');

    isValid &=
        validation.emptyCheck(email, 'tbEmail', 'Vui lòng nhập email') &&
        validation.emailFormatCheck(email, 'tbEmail', 'Email không hợp lệ');

    isValid &= validation.emptyCheck(password, 'tbMatKhau', 'Vui lòng nhập mật khẩu');

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
    isEditing = true;
    const selectedEmployee = employees.editEmployee(employeeId);
    getEl('account').disabled = true;
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

    if (!updatedEmployee) {
        isEditing = true;
        return;
    }

    $('#myModal').modal('hide');

    isEditing = false;
    clearField();
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

    let currentlyEditedEmployeeId = null;
    getEl('tableDanhSach').addEventListener('click', event => {
        const target = event.target;

        console.log(currentlyEditedEmployeeId);

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

            if (employeeId === currentlyEditedEmployeeId) {
                return;
            }

            currentlyEditedEmployeeId = employeeId;

            document.querySelectorAll('.sp-thongbao').forEach(span => {
                if (span.innerHTML.trim() !== '') {
                    span.style.display = 'none';
                }
            });

            handleEdit(employeeId);
        }
    });
}

// Events
getEl('btnAddEmployeeOpen').addEventListener('click', () => {
    if (isEditing) {
        document.querySelectorAll('.sp-thongbao').forEach(span => {
            if (span.innerHTML.trim() !== '') {
                span.style.display = 'none';
            }
        });
        getEl('btnUpdate').style.display = 'none';
        getEl('btnAddEmployee').style.display = 'inline-block';
        clearField();
        isEditing = false;
    }
});

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

function clearField() {
    getEl('account').disabled = false;
    getEl('account').value = '';
    getEl('fullName').value = '';
    getEl('email').value = '';
    getEl('password').value = '';
    getEl('workDate').value = '';
    getEl('basicSalary').value = '';
    getEl('position').value = getEl('position')[0].value;
    getEl('workHours').value = '';
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
