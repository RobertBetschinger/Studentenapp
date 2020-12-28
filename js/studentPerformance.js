function createUserPie() {
  console.log("createUserPie")
  var saveArray = generateData();
  if (saveArray == null || (saveArray[0] == 0 && saveArray[1] == 0)) {
    document.getElementById("pUserData").style.display = "block";
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
    loadData();
  }
}

function generateData() {function createUserPie() {
  console.log("createUserPie")
  var saveArray = generateData();
  if (saveArray == null || (saveArray[0] == 0 && saveArray[1] == 0)) {
    document.getElementById("pUserData").style.display = "block";
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
    loadData();
  }
}

function generateData() {
  console.log("generateData")
  var saveArray = JSON.parse(localStorage.getItem("statArray"));
  if (saveArray == undefined || saveArray == null || (saveArray != undefined && saveArray.length == 0) || (saveArray[0] == 0 && saveArray[1] == 0)) {
    console.log("saveArray stimmt nicht/ nicht vorhanden, saveArray: " + saveArray)
    return null;
  } else {
    var arr = saveArray;
    var result = [0, 0];

    for (var i = 0; i < arr.length; i++) {
      result[0] = result[0] + arr[i][3];
      result[1] = result[1] + arr[i][4];
    }
    return result;
  }
}

/*async function createAvPie() {
  console.log("createAvPiesdfsdfsdfdsfdsfdsdsfdsf")
  var avData = await loadAvPie();
  if (avData == null || avData == undefined | (avData[0] == 0 && avData[1] == 0)) {
    console.log("avPie kann nicht dargestellt werden " + avData);
    document.getElementById("pAvData").style.display = "block";
  } else {
    new Chart(document.getElementById("chart_Av"), {
      type: 'pie',
      data: {
        labels: ["right", "wrong"],
        datasets: [{
          label: "Antworten richtig/falsch",
          backgroundColor: ["#4299E1", "#800000"],
          data: avData
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Durchschnittsperformance'
        }
      }
    });
  }
}*/

async function loadAvPie() {
  console.log("loadAvPie")
  var json = [0, 0];
  const result = await $.ajax({
    type: 'GET',
    url: 'https://projektseminarlfrb.herokuapp.com/stats',
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

async function loadData() {
  console.log("loadData")
  const result = await $.ajax({
    type: 'GET',
    url: 'https://projektseminarlfrb.herokuapp.com/stats',
    dataType: 'json',
    success: function (data) {
      return data;
    },
    error: function (result) {
      return null;
    }
  });

  var saveArray = localStorage.getItem("statArray");
  var arr = JSON.parse(saveArray);

  for (var i = 0; i < arr.length; i++) {
    index = result.findIndex(x => x.category_name === arr[i][1] && x.subcategory_name === arr[i][2])
    if (index != -1) {
      result[index].aCorr = result[index].aCorr + arr[i][3];
      result[index].aFalse = result[index].aFalse + arr[i][4];
    }
  }
  updateSeverData(result);
}

function updateSeverData(arr) {
  console.log("updateServerData")
  for (var i = 0; i < arr.length; i++) {
    var id = (arr[i])._id;
    var data = {
      'aCorr': arr[i].aCorr,
      'aFalse': arr[i].aFalse
    }
    $.ajax({
      type: 'PATCH',
      url: 'https://projektseminarlfrb.herokuapp.com/stats' + '/' + id,
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (result) {
        return data;
      },
      error: function (result) {
        console.log("Es gab einen Fehler beim Updaten des Servers " + result);
        return null;
      }
    });
  }
}


  console.log("generateData")
  var saveArray = JSON.parse(localStorage.getItem("statArray"));
  if (saveArray == undefined || saveArray == null || (saveArray != undefined && saveArray.length == 0) || (saveArray[0] == 0 && saveArray[1] == 0)) {
    console.log("saveArray stimmt nicht/ nicht vorhanden, saveArray: " + saveArray)
    return null;
  } else {
    var arr = saveArray;
    var result = [0, 0];

    for (var i = 0; i < arr.length; i++) {
      result[0] = result[0] + arr[i][3];
      result[1] = result[1] + arr[i][4];
    }
    return result;
  }
}

async function createAvPie() {
  console.log("createAvPie")
  var avData = await loadAvPie();
  if (avData == null || avData == undefined | (avData[0] == 0 && avData[1] == 0)) {
    console.log("avPie kann nicht dargestellt werden " + avData);
    document.getElementById("pAvData").style.display = "block";
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
        responsive: true,
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
  var json = [0, 0];
  const result = await $.ajax({
    type: 'GET',
    url: 'https://projektseminarlfrb.herokuapp.com/stats',
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

async function loadData() {
  console.log("loadData")
  const result = await $.ajax({
    type: 'GET',
    url: 'https://projektseminarlfrb.herokuapp.com/stats',
    dataType: 'json',
    success: function (data) {
      return data;
    },
    error: function (result) {
      return null;
    }
  });

  var saveArray = localStorage.getItem("statArray");
  var arr = JSON.parse(saveArray);

  for (var i = 0; i < arr.length; i++) {
    index = result.findIndex(x => x.category_name === arr[i][1] && x.subcategory_name === arr[i][2])
    if (index != -1) {
      result[index].aCorr = result[index].aCorr + arr[i][3];
      result[index].aFalse = result[index].aFalse + arr[i][4];
    }
  }
  updateSeverData(result);
}

function updateSeverData(arr) {
  console.log("updateServerData")
  for (var i = 0; i < arr.length; i++) {
    var id = (arr[i])._id;
    var data = {
      'aCorr': arr[i].aCorr,
      'aFalse': arr[i].aFalse
    }
    $.ajax({
      type: 'PATCH',
      url: 'https://projektseminarlfrb.herokuapp.com/stats' + '/' + id,
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (result) {
        return data;
      },
      error: function (result) {
        console.log("Es gab einen Fehler beim Updaten des Servers " + result);
        return null;
      }
    });
  }
}

