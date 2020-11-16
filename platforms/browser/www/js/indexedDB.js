window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB.");
    }

var restaurantData = [ { id: 0, name: "",picture:"", type: "", date: "",time: "", price: " ",service: "", clean: "", food: "", note: "", reporter:"" }
];
var db;
var request = window.indexedDB.open('RestaurantDB', 1);
var tableDB = document.getElementById('tableDB');
var notificationBtn = document.getElementById('enable');
var form = document.getElementById('first_form');

if(Notification.permission === 'denied' || Notification.permission === 'default') {
    notificationBtn.style.display = 'block';
} else {
    notificationBtn.style.display = 'none';
}

request.onerror = function (event) {
    console.log('error: ');
};
request.onsuccess = function (event) {
    db = request.result;
    displayData();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore('RestaurantDB', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex("name","name",{unique: false});
    objectStore.createIndex("type","type",{unique: false});
    objectStore.createIndex("date","date",{unique: false});
    objectStore.createIndex("time","time",{unique: false});
    objectStore.createIndex("price","price",{unique: false});
    objectStore.createIndex("service","service",{unique: false});
    objectStore.createIndex("clean","clean",{unique: false});
    objectStore.createIndex("food","food",{unique: false});
    objectStore.createIndex("note","note",{unique: false});
    objectStore.createIndex("reporter","reporter",{unique: false});
    for (var i in restaurantData) {
        objectStore.add(restaurantData[i]);
    }
};

$(document).ready(function () {
    $('.add-row').click(function () {
        var id = $('#r-id').val();
        var name = $('#r-name').val();
        var picture = $('#r-picture').val();
        var type = $('#r-type').val();
        var date = $('#r-date').val();
        var time = $('#r-time').val();
        var price = $('#r-price').val();
        var service = $('#service-r').val();
        var clean = $('#clean-r').val();
        var food = $('#food-r').val();
        var note = $('#note').val();
        var reporter = $('#reporter').val();
        $(".error").remove();
        if (name.length < 3) {
            $('#r-name').after('<p class="error">This field is required</p>');
          }
       else
       {
        add(id, name,picture, type,date, time, price, service, clean, food, note, reporter);
        }
    });
});

function add(idRestaurant, nameRestaurant,pictureRestaurant, typeRestaurant, dateVisit, timeVisit, pricePerOne,
    serviceRating, cleanRating, foodRating, Note, Reporter) {

    var request = db
        .transaction(['RestaurantDB'], 'readwrite')
        .objectStore('RestaurantDB')
        .add({ id: idRestaurant, name: nameRestaurant, picture: pictureRestaurant, type: typeRestaurant,date:dateVisit, time: timeVisit, price: pricePerOne,
        service: serviceRating, clean: cleanRating, food : foodRating, note: Note, reporter: Reporter });

    request.onsuccess = function (event) {
        displayData();
        alert(`${nameRestaurant}  has been added to your database.`);
        };
        request.onerror = function (event) {
        alert(
        `Unable to add data\r\n ${idRestaurant} is already exist in your database! `
        );
    };
}
form.addEventListener('submit',add,false);
function displayData(idRestaurant, nameRestaurant,pictureRestaurant, typeRestaurant,dateVisit, timeVisit,pricePerOne,serviceRating,
    cleanRating,foodRating,Note,Reporter) {
    tableDB.innerHTML = "";
    var objectStore = db.transaction('RestaurantDB').objectStore('RestaurantDB');
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
        if (cursor) {
            var trItem = document.createElement('tr');
            idRestaurant = cursor.value.id;
            nameRestaurant = cursor.value.name;
            pictureRestaurant = cursor.value.picture;
            typeRestaurant = cursor.value.type;
            dateVisit = cursor.value.date;
            timeVisit = cursor.value.time;
            pricePerOne = cursor.value.price;
            serviceRating = cursor.value.service;
            cleanRating = cursor.value.clean;
            foodRating = cursor.value.food;
            Note = cursor.value.note;
            Reporter = cursor.value.reporter;

            pictureRestaurant = "<img width='100px' height='100px' src='"+
            'data:image/jpeg;base64,' + btoa(cursor.value.data)+
            "'/>";

            trItem.innerHTML = `<tr></td><td>${idRestaurant}</td><td>${nameRestaurant}</td><td>${pictureRestaurant}</td><td>
            ${typeRestaurant}</td><td>${dateVisit}</td><td>${timeVisit}</td><td>${pricePerOne}</td><td>${serviceRating}</td>
            <td>${cleanRating}</td><td>${foodRating}</td><td>${Note}</td><td>${Reporter}</td></tr>`;

            var deleteButton = document.createElement('button');
            var editButton = document.createElement('button')
            editButton.innerHTML = `<tr><td>Edit</td></tr>`
            deleteButton.innerHTML = `<tr><td>X</td></tr>`;
            trItem.appendChild(deleteButton);
            trItem.appendChild(editButton);
            // here we are setting a data attribute on our delete button to say what task we want deleted if it is clicked!
            deleteButton.setAttribute('data-task', cursor.value.id);
            editButton.setAttribute('data-edit', cursor.value.id);
            deleteButton.onclick = function(event) {
            deleteItem(event);
            }
            editButton.onclick = function(event){
                editItem(event);
            }
            
            tableDB.appendChild(trItem);

        cursor.continue();}

        else {
            console.log("error");

        }
    }
}

function editItem(event){

}
function deleteItem(event) {
    // retrieve the name of the task we want to delete
    var dataTask = event.target.getAttribute('data-task');

    // open a database transaction and delete the task, finding it by the name we retrieved above
    var transaction = db.transaction(["RestaurantDB"], "readwrite");
    var request = transaction.objectStore("RestaurantDB").delete(dataTask);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
        // delete the parent of the button, which is the list item, so it no longer is displayed
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    };
};

