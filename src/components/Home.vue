<template>
  <div class="list row">
    <div class="col-md-12">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search"
          v-model="searchQuery"
          @keyup="searchTitle"
        />
        <!-- <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="searchTitle"
          >
            Search
          </button>
        </div> -->
      </div>
    </div>
    <div class="col-md-6">
      <div v-if="results != null" class="resultbox">
        <h1>TEST</h1>
        <h2>Results</h2>
        <div v-for="(result, type) in results" :key="type">
          <div v-if="result.length != 0" class="mb-3">
            <h5 class="capitalize">{{ type }}</h5>
            <ul class="list-group">
              <li
                class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(resultitem, index) in result"
                :key="index"
                @click="
                  getSubjectData(resultitem, type);
                  setActive(resultitem, type, index);
                "
              >
                {{ resultitem.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- <h4>Regions List</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(region, index) in regions"
          :key="index"
          @click="setActiveRegion(region, index)"
        >
          {{ region.name }}
        </li>
      </ul> -->

      <div class="">
        <h2>Regions</h2>
        <p>{{ regions }}</p>
        <h2>Stations</h2>
        <p>{{ stations }}</p>
        <h2>Items</h2>
        <p>{{ items }}</p>
      </div>
    </div>
    <div class="col-md-6">
      <div v-if="subject && subject.type == 'regions'">
        <h4>Region</h4>
        <div>
          <label><strong>Name:</strong></label> {{ subject.name }}
          <p><strong>Stations</strong></p>
          <p v-for="station in this.stations" :key="station.idStation">
            {{ station.name }}
          </p>
          <p><strong>Resources</strong></p>
          ...
        </div>
      </div>

      <div v-else-if="subject && subject.type == 'stations'">
        <h4>Station</h4>
        <div>
          <label><strong>Name:</strong></label> {{ this.new.name }}<br />
          <label><strong>In Region:</strong></label> {{ this.new.region }}<br />
          <label><strong>Size:</strong></label> {{ this.new.size }}<br />
          <label><strong>Level:</strong></label>
          <input
            type="number"
            class="ml-2"
            v-model="this.new.level"
            style="width: 75px"
          /><br />
          <label><strong>Demand: </strong></label> {{ this.new.item }}<br />
          <input
            type="number"
            v-model="this.new.supplied_demand"
            style="width: 75px"
          />
          of
          {{ this.new.required_demand }}<br />
          <button class="btn btn-success mt-3" @click="updateStation(this.new)">
            Update
          </button>
        </div>

        <!-- <router-link
          :to="'/stations/' + currentRegion.id"
          class="badge badge-warning"
          >Edit</router-link
        > -->
      </div>
    </div>
    <div class="col-md-12">
      <h1>Demands</h1>
    </div>
  </div>
</template>

<script>
import RegionDataService from "../services/RegionDataService";
import StationDataService from "../services/StationDataService";
import ItemDataService from "../services/ItemDataService";

export default {
  name: "regions-list",
  data() {
    return {
      regions: [],
      currentRegion: null,
      currentIndex: -1,
      results: null,
      stations: [],
      items: [],
      searchQuery: "",
      subject: null,
      new: null,
    };
  },
  methods: {
    // retrieveData() {
    //   let services = [
    //     { name: "regions", api: RegionDataService, data: this.regions },
    //     { name: "stations", api: StationDataService, data: this.stations },
    //     { name: "items", api: ItemDataService, data: this.items },
    //   ];
    //   for (let i in services) {
    //     console.log(services[i].data);
    //     services[i].api
    //       .getAll()
    //       .then((response) => {
    //         services[i].data = response.data;
    //       })
    //       .catch((e) => {
    //         console.log(e);
    //       });
    //   }
    // },
    retrieveRegions() {
      RegionDataService.getAll()
        .then((res) => {
          this.regions = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    retrieveStations() {
      StationDataService.getAll()
        .then((res) => {
          this.stations = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    retrieveItems() {
      ItemDataService.getAll()
        .then((res) => {
          this.items = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getSubjectData(subject, type) {
      switch (type) {
        case "regions": {
          RegionDataService.get(subject.idRegion).then((res) => {
            console.log(res.data);
            this.new = res.data;
            this.getStationsForRegion(subject.idRegion);
          });
          break;
        }
        case "stations": {
          StationDataService.get(subject.idStation).then((res) => {
            console.log(res.data);
            this.new = res.data;
            this.getStationItem(res.data.idItem);
            this.getStationRegion(res.data.idRegion);
          });
          break;
        }
        case "items": {
          ItemDataService.get(subject.idItem).then((res) => {
            console.log(res.data);
            this.new = res.data;
          });
          break;
        }
      }
    },

    getStationRegion(key) {
      RegionDataService.get(key).then((res) => {
        this.new.region = res.data.name;
      });
    },

    getStationItem(key) {
      ItemDataService.get(key).then((res) => {
        this.new.item = res.data.name;
      });
    },

    getStationsForRegion(key) {
      StationDataService.getStationsByRegion(key).then((res) => {
        this.stations = res.data;
      });
    },

    updateStation(subject) {
      console.table(subject);
      StationDataService.update(subject.idStation, subject);
    },

    refreshList() {
      this.retrieveRegions();
      this.currentRegion = null;
      this.currentIndex = -1;
    },

    setActive(subject, type, index) {
      console.log(subject, type, index);
      subject.type = type;
      this.subject = subject;
      this.currentIndex = subject ? index : -1;
    },

    setActiveRegion(region, index) {
      this.currentRegion = region;
      this.currentIndex = region ? index : -1;
    },

    searchTitle() {
      if (this.searchQuery == "") {
        this.results = null;
      } else {
        this.results = {};
        RegionDataService.findByTitle(this.searchQuery)
          .then((response) => {
            this.results.regions = response.data;
            this.setActiveRegion(null);
          })
          .catch((e) => {
            console.log(e);
          });

        StationDataService.findByTitle(this.searchQuery)
          .then((response) => {
            this.results.stations = response.data;
            this.setActiveRegion(null);
          })
          .catch((e) => {
            console.log(e);
          });

        ItemDataService.findByTitle(this.searchQuery)
          .then((response) => {
            this.results.items = response.data;
            this.setActiveRegion(null);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  mounted() {
    this.retrieveRegions();
    this.retrieveStations();
    this.retrieveItems();

    // this.retrieveData();
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 1080px;
  margin: auto;
}

.capitalize::first-letter {
  text-transform: capitalize;
}

.resultbox {
  background-color: lightgray;
  padding: 10px;
  border-radius: 5px;
}
</style>