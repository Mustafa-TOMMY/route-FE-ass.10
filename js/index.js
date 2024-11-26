var markNameInput = document.getElementById("bookmarkName");
var siteUrlInput = document.getElementById("siteUrl");
var displayLinks = document.getElementById("mainTable");
var upBtn = document.getElementById("updateBtn");
var adBtn = document.getElementById("addBtn");
var undoBtn = document.getElementById("undoBtn");
var nameAlert = document.getElementById("nameAlert")
var upIn;
var allLinks = [];
var reorderedArrayUp = []
var reorderedArraydown = []
var markNameRegex = /^[\w\s-]{3,20}$/i
var markUrlRegex = /^(https:\/\/|http:\/\/)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&\/\/=]*)/i

if (localStorage.getItem("links") != null) {
    allLinks = JSON.parse(localStorage.getItem("links"))
    displaylinks(allLinks)
}
else {
    allLinks = [];
}

function addlink() {
    if (validation() && repetitve()) {
        var link = {
            mark: markNameInput.value,
            url: siteUrlInput.value,
        }
        allLinks.push(link);
        clearForm();
        clearvalid();
        displaylinks(allLinks);
        localStorage.setItem("links", JSON.stringify(allLinks));
    }
    else if (repetitve() == false) {
        Swal.fire({
            title: "Repeated bookmark name",
            text: `This bookmark name is already in use.Please choose a unique name.`,
            icon: "warning"
        });
    }
    else {
        Swal.fire({
            title: "Site Name or Url is not valid, Please follow the rules below :",
            text: `Site name must contain at least 3 characters
                   Site URL must be a valid one`,
            icon: "error"
        });
    }
}

function clearForm() {
    markNameInput.value = null;
    siteUrlInput.value = null;
}

function clearvalid() {
    bookmarkName.classList.remove("is-valid")
    siteUrl.classList.remove("is-valid")
    nameAlert.classList.add("d-none")
    urlAlert.classList.add("d-none")
}

function displaylinks(arr) {
    var tableDiv = "";
    for (i = 0; i < arr.length; i++) {
        tableDiv +=
            `        
            <tr>
                <td>${i + 1}</td>
                <td>${arr[i].mark}</td>
                <td><button type="button" class="btn btn-dark" onclick="location.href='${arr[i].url}'"><i class="fa-regular fa-eye"></i> visit</button></td>
                <td><button class="btn btn-danger" onclick="deleteLinks(${i})"><i class="fa-solid fa-trash"></i> delete</button></td>
                <td><button class="btn btn-warning" onclick="hoistingLinks(${i})"><i class="fa-solid fa-pen"></i> update</button></td>
                <td><button class="btn btn-info" onclick="upword(${i})"><i class="fa-solid fa-arrow-up"></i></button>
                <button class="btn btn-info" onclick="downword(${i})"><i class="fa-solid fa-arrow-down"></i></button></td>
            </tr>
        `
    }
    displayLinks.innerHTML = tableDiv
}

function deleteLinks(deletindex) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            allLinks.splice(deletindex, 1)
            displaylinks(allLinks)
            localStorage.setItem("links", JSON.stringify(allLinks))
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
}

function hoistingLinks(updatedindex) {
    upIn = updatedindex
    markNameInput.value = allLinks[updatedindex].mark
    siteUrlInput.value = allLinks[updatedindex].url
    upBtn.classList.remove("d-none")
    adBtn.classList.add("d-none")
    undoBtn.classList.remove("d-none")
}

function updatelink() {
    if (markNameInput.value !== allLinks[upIn].mark) {
        if (validation() && repetitve()) {
            allLinks[upIn].mark = markNameInput.value
            allLinks[upIn].url = siteUrlInput.value
            displaylinks(allLinks)
            localStorage.setItem("links", JSON.stringify(allLinks))
            clearForm();
            upBtn.classList.add("d-none")
            adBtn.classList.remove("d-none")
            undoBtn.classList.add("d-none")
        }
        else if (repetitve() == false) {
            Swal.fire({
                title: "Repeated bookmark name",
                text: `This bookmark name is already in use.Please choose a unique name.`,
                icon: "warning"
            });
        }
        else {
            Swal.fire({
                title: "Site Name or Url is not valid, Please follow the rules below :",
                text: `Site name must contain at least 3 characters
            Site URL must be a valid one`,
                icon: "error"
            });
        }
    }
    else {
        allLinks[upIn].mark = markNameInput.value
        allLinks[upIn].url = siteUrlInput.value
        displaylinks(allLinks)
        localStorage.setItem("links", JSON.stringify(allLinks))
        clearForm();
        upBtn.classList.add("d-none")
        adBtn.classList.remove("d-none")
        undoBtn.classList.add("d-none")

    }
}

function search(term) {
    var searchList = []
    for (i = 0; i < allLinks.length; i++) {
        if (allLinks[i].mark.includes(term)) {
            searchList.push(allLinks[i])
        }
    }
    searchAlert.classList.add("d-none")
    displaylinks(searchList)
    if (searchList.length == 0) {
        displaylinks(allLinks)
        searchAlert.classList.remove("d-none")
    }
}

function isInputValid(parRegex, parInputValue, alertID, tag) {
    if (parRegex.test(parInputValue) == true) {
        alertID.classList.add("d-none")
        tag.classList.add("is-valid")
        tag.classList.replace("is-invalid", "is-valid")
        return true
    }
    else {
        alertID.classList.remove("d-none")
        tag.classList.add("is-invalid")
        return false
    }
}

function InputValid(parRegex, parInputValue) {
    if (parRegex.test(parInputValue)) {
        return true
    }
    else {
        return false
    }
}

function validation() {
    if (
        InputValid(markNameRegex, markNameInput.value) &&
        InputValid(markUrlRegex, siteUrlInput.value)
    ) {
        return true
    }
    else {
        return false
    }
}

function repetitve() {
    // var x = markNameInput.value.trim().toLowerCase();
    // var y = allLinks[upIn].mark.trim().toLowerCase();
    var repetitvearray = []
    for (i = 0; i < allLinks.length; i++) {
        if (allLinks[i].mark.trim().toLowerCase() == markNameInput.value.trim().toLowerCase()) {
            repetitvearray.push(allLinks[i])
        }
    }
    if (repetitvearray.length == 0) {
        return true
    } else {
        return false
    }
}

function upword(upwordIndex) {
    var arrayInLocal = JSON.parse(localStorage.getItem("links"))
    if (upwordIndex == 0) {
        var riseSelectedObject = arrayInLocal.splice(upwordIndex, 1)[0]
        console.log(arrayInLocal);
        arrayInLocal.splice(arrayInLocal.length, 0, riseSelectedObject)
    } else {
        var riseSelectedObject = arrayInLocal.splice(upwordIndex, 1)[0]
        var riseSelectedObject2 = arrayInLocal.splice((upwordIndex - 1), 1)[0]
        arrayInLocal.splice(upwordIndex - 1, 0, riseSelectedObject)
        arrayInLocal.splice(upwordIndex, 0, riseSelectedObject2)
    }
    localStorage.setItem("links", JSON.stringify(arrayInLocal));
    displaylinks(arrayInLocal)

    // ------------------------another solution ------------------------------

    // var arrayInLocal = JSON.parse(localStorage.getItem("links"))
    // if (upwordIndex == 0) {
    //     var array1 = arrayInLocal.slice(upwordIndex, arrayInLocal.length)
    //     var array11 = array1.slice(0, 1)
    //     var array12 = array1.slice(1, array1.length)
    //     reorderedArrayUp = array12.concat(array11)
    // }
    // else {
    //     var array1 = arrayInLocal.slice(upwordIndex, arrayInLocal.length)
    //     var array11 = array1.slice(0, 1)
    //     var array12 = array1.slice(1, array1.length)
    //     // ------------------------------------
    //     var array2 = arrayInLocal.slice(0, upwordIndex)
    //     var array21 = array2.slice(array2.length - 1, array2.length)
    //     var array22 = array2.slice(0, array2.length - 1)
    //     // ------------------------------------
    //     reorderedArrayUp = array22.concat(array11).concat(array21).concat(array12)
    // }
    // localStorage.setItem("links", JSON.stringify(reorderedArrayUp));
    // displaylinks(reorderedArrayUp)
}

function downword(downwordIndex) {
    var arrayInLocal = JSON.parse(localStorage.getItem("links"))
    if (downwordIndex == arrayInLocal.length - 1) {
        var riseSelectedObject = arrayInLocal.splice(downwordIndex, 1)[0]
        arrayInLocal.splice(0, 0, riseSelectedObject)
    } else {
        var riseSelectedObject = arrayInLocal.splice(downwordIndex, 1)[0]
        arrayInLocal.splice(downwordIndex + 1, 0, riseSelectedObject)
    }
    localStorage.setItem("links", JSON.stringify(arrayInLocal));
    displaylinks(arrayInLocal)

    // ------------------------another solution ------------------------------
    // var arrayInLocal = JSON.parse(localStorage.getItem("links"))
    // if (downwordIndex == 0) {
    //     var array1 = arrayInLocal.slice(downwordIndex + 1, arrayInLocal.length)
    //     var array11 = array1.slice(0, 1)
    //     var array12 = array1.slice(1, array1.length)
    //     var array2 = arrayInLocal.slice(downwordIndex, downwordIndex + 1)
    //     reorderedArraydown = array11.concat(array2).concat(array12)
    // }
    // else if (downwordIndex == arrayInLocal.length - 1) {
    //     var array1 = arrayInLocal.slice(0, downwordIndex)
    //     var array2 = arrayInLocal.slice(downwordIndex, arrayInLocal.length)
    //     reorderedArraydown = array2.concat(array1)
    // }
    // else {
    //     var array1 = arrayInLocal.slice(downwordIndex + 1, arrayInLocal.length)
    //     var array11 = array1.slice(0, 1)
    //     var array12 = array1.slice(1, array1.length)
    //     // ------------------------------------
    //     var array2 = arrayInLocal.slice(0, downwordIndex + 1)
    //     var array21 = array2.slice(array2.length - 1, array2.length)
    //     var array22 = array2.slice(0, array2.length - 1)
    //     // ------------------------------------
    //     reorderedArraydown = array22.concat(array11).concat(array21).concat(array12)
    // }
    // localStorage.setItem("links", JSON.stringify(reorderedArraydown));
    // displaylinks(reorderedArraydown)
}

function undoData() {
    markNameInput.value = allLinks[upIn].mark
    siteUrlInput.value = allLinks[upIn].url
}
