function loadData() {
	console.log("startStuff")
	$('#divLoadingImage').show();
	$.ajax({
		type: 'GET',
		url: 'https://projektseminarlfrb.herokuapp.com/categorys',
		dataType: 'json',
		success: function (data) {
			parseData(data);
		},
		error: function (err) {
			console.log(err);
			alert("Es gab einen Fehler beim Laden der Daten")
		},
		complete: function () {
			$('#divLoadingImage').hide();
			document.getElementById("divLoadingImage").style.display = "none";
		}
	})
}

function parseData(data) {
	console.log("parse data")
	let json = JSON.parse(JSON.stringify(data))
	createElements(json)
}

function createElements(json) {
	console.log("createElements")
	var select = document.getElementById('ul_list');

	for (var i = 0; i < json.length; i++) {
		var newCategory = document.createElement("li");
		newCategory.setAttribute("selected", "false");

		newCategory.className = "newCategory font-bold break-words py-1 list-none";
		var ul2 = document.createElement("ul");
		newCategory.setAttribute("name", json[i].category_name);
		ul2.className = "ul2";
		newCategory.innerHTML = json[i].category_name;

		select.appendChild(newCategory);
		newCategory.appendChild(ul2);

		for (var j = 0; j < json[i].sub_categories.length; j++) {
			if (json[i].sub_categories[j].subcategory_name === undefined) {
				console.log("undefined entry")
			} else {
				console.log(json[i].sub_categories[j])
			var newSubcategory = document.createElement("li");
			newSubcategory.innerHTML = json[i].sub_categories[j].subcategory_name;
			newSubcategory.className = "subMenu font-normal break-words pl-2 py-1";
			newSubcategory.setAttribute("cat", json[i].category_name);
			newSubcategory.setAttribute("selected", false)
			newSubcategory.style.display = "none";
			ul2.appendChild(newSubcategory);
			}
		};
	}

	var menuItemName = "subMenu";
	var catItemName = "newCategory";
	var buttonClass = "btn_weiter";
	getAllMenuItems(menuItemName, catItemName, buttonClass);
}

function getAllMenuItems(menuItemName, catItemName, buttonClassR) {
	console.log("getAllMenuItems")
	var menuItems = elements = document.getElementsByClassName(menuItemName);
	var catItems = document.getElementsByClassName(catItemName);
	var menuItemsArray = new Array();

	for (var i = 0; i < menuItems.length; i++) {
		menuItemsArray[i] = new Array();
		menuItemsArray[i][0] = menuItems[i];
		menuItemsArray[i][1] = menuItems[i].innerHTML;
		//is selected or not
		menuItemsArray[i][2] = false;
		menuItemsArray[i][3] = menuItems[i].getAttribute("cat");
		menuItemsArray[i][0].style.cursor = 'pointer';
		menuItems[i].onclick = function () {
			for (var i = 0; i < menuItemsArray.length; i++) {
				if (this == menuItemsArray[i][0]) {
					if (!menuItemsArray[i][2]) {
						menuItemsArray[i][2] = true;
					} else {
						menuItemsArray[i][2] = false;
					}
					transformItems(menuItemsArray[i]);
				}
			}
		}
	}
	for (var i = 0; i < catItems.length; i++) {
		catItems[i].onclick = function () {
			if (this.getAttribute("selected") == "false") {
				this.setAttribute("selected", "true");

				for (var i = 0; i < menuItemsArray.length; i++) {
					if (menuItemsArray[i][3] == this.getAttribute("name")) {
						menuItems[i].style.display = "block"
					}
				}
			}
			else {
				this.setAttribute("selected", "false");
				for (var i = 0; i < menuItemsArray.length; i++) {
					if (menuItemsArray[i][3] == this.getAttribute("name")) {
						if (!menuItemsArray[i][2]) {
							menuItems[i].style.display = "none";

						} else if (menuItemsArray[i][2]) {
							for (var i = 0; i < menuItemsArray.length; i++) {
								if (menuItemsArray[i][3] == this.getAttribute("name")) {
									menuItems[i].style.display = "block"
								}
							}
						}
					}
				}
			}
		}
	}
	var buttonStartR = document.getElementsByClassName(buttonClassR);
	for (var i = 0; i < buttonStartR.length; i++) {
		buttonStartR[i].onclick = function () {
			var selectedArray = new Array();
			var category;
			var index = 0;
			var counter = 0;
			for (var i = 0; i < menuItemsArray.length; i++) {
				if (menuItemsArray[i][2]) {
					index = i;
					counter++;
					selectedArray[i] = menuItemsArray[i][1];
					category = menuItemsArray[i][3];
				}
			}
			if (counter > 1) {
				alert("Bitte wählen Sie nur eine Kategorie aus.");
			}
			else if (selectedArray.length > 0) {
				sessionStorage.setItem("scat", selectedArray[index]);
				sessionStorage.setItem("cat", category);
				window.location.href = 'lernen_quiz.html';
			} else {
				alert("Bitte wählen Sie mindestens eine Kategorie aus.");
			}
		}
	}

}

function transformItems(menuItemSelected) {
	if (menuItemSelected[2]) {
		menuItemSelected[0].style.backgroundColor = "rgb(200, 200, 200)";
	} else {
		menuItemSelected[0].style.backgroundColor = "transparent";
	}
}

