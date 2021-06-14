const listloggedout = document.querySelectorAll(".logged-out");
const listloggedin = document.querySelectorAll(".logged-in");
const acountData = document.querySelector(".acountData");

const configuraMenu = (user) => {
  if (user) {
    db.collection("usuarios")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
                <p>Name: ${doc.data().nombre}</p>
                <p>Email: ${user.email}</p>
                <p>Phone: ${doc.data().telefono}</p>
                <p>Location: ${doc.data().direccion}</p>
            `;
        acountData.innerHTML = html;
      });

    listloggedin.forEach((item) => (item.style.display = "block"));
    listloggedout.forEach((item) => (item.style.display = "none"));
  } else {
    acountData.innerHTML = "";
    listloggedin.forEach((item) => (item.style.display = "none"));
    listloggedout.forEach((item) => (item.style.display = "block"));
  }
};

const propertiesList = document.getElementById("propertiesList");

const getProperties = (data) => {
  if (data.length) {
    let html = "";

    var btnroadmap = document.getElementById("btnroadmap");
    var btnsatelite = document.getElementById("btnsatellite");
    var btnhybrid = document.getElementById("btnhybrid");
    var btnterrain = document.getElementById("btnterrain");

    var coordenadas = {
      lat: 23.2401797,
      lng: -106.4331511,
    };

    var localidades = [];
    // data.forEach((doc) => {
    //   localidades.push({lat: doc.data().Location.Latitud, lng: doc.data().Location.Longitud})
    // });

    function MapInit() {
      fetch("properties.json").then(function (response) {
        response.json().then(function (data) {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: coordenadas,
            zoom: 3,
          });

          data.forEach((markerFetch) => {
            var information =
              "<strong>Name: </strong>" +
              markerFetch.name +
              "| <strong>casos: </strong> " +
              markerFetch.category;

            var infoWindow = new google.maps.InfoWindow({
              content: information,
            });

            let marker = new google.maps.Marker({
              map: map,
              position: new google.maps.LatLng(
                markerFetch.location.latitude,
                markerFetch.location.longitude
              ),
              title: markerFetch.name + registro.category,
            });

            marker.addListener("click", function () {
              infoWindow.open(map, marker);
            });
          });
        });
      });

      var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var marcadores = [];
      var cuenta = 1;

      localidades.forEach((localidad) => {
        console.log(localidad);

        let marcador = new google.maps.Marker({
          map: map,
          position: localidad,
          label: labels[cuenta % labels.length],
        });

        marcadores.push(marcador);
        cuenta++;
      });

      var markerCluster = new MarkerClusterer(map, marcadores, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        gridSize: 60,
        maxZoom: 10,
      });

      btnroadmap.addEventListener("click", function () {
        map.setMapTypeId("roadmap");
      });

      btnsatelite.addEventListener("click", function () {
        map.setMapTypeId("satellite");
      });

      btnhybrid.addEventListener("click", function () {
        map.setMapTypeId("hybrid");
      });

      btnterrain.addEventListener("click", function () {
        map.setMapTypeId("terrain");
      });
    }

    data.forEach((doc) => {
      const properties = doc.data();
      console.log(properties);
      const columna = `
        <div class="col-12 col-md-4">
          <img src="${properties.Image}" alt="${properties.Name}">
          <p class="propertyName">${properties.Name}</p>
          <p class="propertyStatus">${properties.Category} / ${properties.Status}</p>
        </div>
      `;

      html += columna;
    });

    propertiesList.innerHTML = html;
  } else {
    propertiesList.innerHTML =
      '<p class="alternativeText">Please Log in to see the properties.</p>';
    ('<img class="cityscape" src="./images/cityLandscape.svg"/>');
  }
};
