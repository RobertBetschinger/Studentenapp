function createUserPie() {
  console.log("createUserPie")
  var saveArray = JSON.parse(localStorage.getItem("saveArrayLernen"));
  if (saveArray == undefined || saveArray == null || (saveArray[0] == 0 && saveArray[1] == 0)) {
    document.getElementById("pUserData").style.display = "block";
    console.log("saveArray stimmt evtl nicht, saveArray: " + saveArray)
  } else {
    new Chart(document.getElementById("chart_Student"), {
      type: 'pie',
      data: {
        labels: ["right", "wrong"],
        datasets: [{
          label: "Antworten richtig/falsch",
          backgroundColor: ["#90CDF4", "#800000"],
          data: saveArray
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Deine Performance'
        }
      }
    });
  }
}

async function createAvPie() {
  console.log("createAvPie")
  var avData = await loadAvPie();
  if (avData == null || avData[0] == 0 && avData[1] == 0) {
    document.getElementById("pAvData").style.display = "block";
    console.log("avData stimmt evtl nicht, avData: " + avData)
  } else {
    new Chart(document.getElementById("chart_Av"), {
      type: 'pie',
      data: {
        labels: ["right", "wrong"],
        datasets: [{
          label: "Antworten richtig/falsch",
          backgroundColor: ["#90CDF4", "#800000"],
          data: avData
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Durchschnittsperformance'
        }
      }
    });
  }

}

async function loadAvPie() {
  console.log("loadAvPie")
  var cValue = sessionStorage.getItem("cat");
  var sValue = sessionStorage.getItem("scat");
  var json = [0, 0];
  const result = await $.ajax({
    type: 'GET',
    url: 'https://projektseminarlfrb.herokuapp.com/stats',
    data: {
      "category_name": cValue,
      "subcategory_name": sValue
    },
    dataType: 'json',
    success: function (data) {
      return data;
    },
    error: function (result) {
      return null;
    }
  });

  for (var i = 0; i < result.length; i++) {
    json[0] = json[0] + result[i].aCorr;
    json[1] = json[1] + result[i].aFalse;
  }
  return json;

}