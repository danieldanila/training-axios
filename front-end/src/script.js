const loginUser = async (email, password) => {
    // Va urma la training
};

const signUpUser = async (email, password) => {
    // Va urma la training
};

const getAllUsers = async () => {
    // Va urma la training
};

const getUserById = async (id) => {
    // Va urma la training
};

const deleteUser = async (id) => {
    // Va urma la training
};

const patchUserDepartment = async (id, idDepartment) => {
    // Va urma la training
};

const getAllDepartments = async () => {
    // Va urma la training
};

const fillTableRow = (table, user) => {
    const row = table.insertRow(-1);
    const c1 = row.insertCell(0);
    const c2 = row.insertCell(1);
    const c3 = row.insertCell(2);
    const c4 = row.insertCell(3);
    const c5 = row.insertCell(4);

    c1.innerText = user.id;
    c2.innerText = user.email;
    c3.innerText = user.password;
    c4.innerText = user.Department ? user.Department.name : "";

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("actionButton");
    deleteButton.addEventListener("click", async () => {
        await deleteUser(user.id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("actionButton");
    editButton.addEventListener("click", async () => {
        const departmentInput = window.prompt("Enter the department name: ");
        const departments = await getAllDepartments();

        let departmentFound = null;
        departments.forEach(async (department) => {
            if (department.name === departmentInput) {
                departmentFound = department;
            }
        });

        if (departmentFound) {
            await patchUserDepartment(user.id, departmentFound.id);
        } else {
            window.alert("The mentioned department does not exist.");
        }
    });

    c5.appendChild(editButton);
    c5.appendChild(deleteButton);
};

const fillTable = async (table, isMyProfile) => {
    const tableRows = Array.from(document.getElementsByTagName("td"));
    tableRows.forEach((tableRow) => {
        tableRow.remove();
    });

    if (isMyProfile === true) {
        const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

        const user = await getUserById(loggedUser.id);

        fillTableRow(table, user);
    } else {
        const users = await getAllUsers();

        users.forEach((user) => {
            fillTableRow(table, user);
        });
    }
};
