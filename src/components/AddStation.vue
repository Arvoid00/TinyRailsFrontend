<template>
  <div class="submit-form">
    <h1>Add a new Station</h1>

    <div v-if="!submitted">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          required
          v-model="station.name"
          name="name"
        />
      </div>
      <div class="form-group">
        <label for="region">Region:</label>
        <select
          name="region"
          id="region"
          class="form-control"
          v-model="station.region"
        >
          <option
            v-for="region in regions"
            :key="region.idRegion"
            :value="region.idRegion"
          >
            {{ region.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="level">Station Level (1-4):</label>
        <input
          type="number"
          id="level"
          name="level"
          min="1"
          max="4"
          class="form-control"
          v-model="station.level"
        />
      </div>
      <div class="form-group">
        <label for="size">Station Size (1-5):</label>
        <input
          type="number"
          id="size"
          name="size"
          min="1"
          max="5"
          v-model="station.size"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="demandQuantity">Demand Quantity</label>
        <input
          type="number"
          id="demandQuantity"
          name="demandQuantity"
          class="form-control"
          v-model="demandQuantity"
          readonly
          tabindex="-1"
        />
      </div>
      <div class="form-group">
        <label for="demand">Demand</label>
        <select
          name="demand"
          id="demand"
          class="form-control"
          v-model="station.demandId"
        >
          <option v-for="item in items" :key="item.idItem" :value="item.idItem">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <div class="dropdown">
          <div id="myDropdown" class="dropdown-content">
            <input
              type="text"
              placeholder="Search.."
              id="myInput"
              @keyup="filterFunction()"
            />
            <div class="d-none" id="inner">
              <a
                v-for="item in items"
                :key="item.idItem"
                :value="item.idItem"
                >{{ item.name }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <label for="itemName">Item</label>
      <div class="item-line">
        <input
          type="text"
          class="form-control"
          id="itemName"
          required
          v-model="itemName"
          name="itemName"
        />
        <button @click="addItem" class="btn btn-warning">Add Item</button>
      </div>
      <div>
        <button @click="saveStation" class="btn btn-success mt-4 w-100">
          Submit
        </button>
      </div>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newStation">Add</button>
    </div>
  </div>
</template>

<script>
import RegionDataService from "../services/RegionDataService";
import StationDataService from "../services/StationDataService";
import ItemDataService from "../services/ItemDataService";

export default {
  name: "add-station",
  data() {
    return {
      station: {
        id: null,
        name: "",
        region: 0,
        size: null,
        level: null,
        supplied_demand: 0,
        demandId: null,
      },
      regions: null,
      itemName: null,
      items: null,
      submitted: false,
    };
  },
  computed: {
    demandQuantity() {
      let demandQuantity = 0;
      switch (this.station.size) {
        case 1:
          demandQuantity = 25;
          break;
        case 2:
          demandQuantity = 50;
          break;
        case 3:
          demandQuantity = 150;
          break;
        case 4:
          demandQuantity = 350;
          break;
        case 5:
          demandQuantity = 1000;
          break;
      }
      return demandQuantity;
    },
  },
  mounted() {
    this.loadRegions();
    this.loadItems();
  },
  methods: {
    async loadRegions() {
      this.regions = await RegionDataService.getAll().then((res) => {
        return res.data;
      });
    },

    async loadItems() {
      this.items = await ItemDataService.getAll().then((res) => {
        return res.data;
      });
    },

    async addItem() {
      console.log(this.items);
      // if (this.items.indexOf(this.item) > -1) {
      ItemDataService.create({ name: this.itemName }).then(() =>
        this.loadItems()
      );
      // }
    },

    saveStation() {
      var data = {
        name: this.station.name,
        region: this.station.region,
        level: this.station.level,
        size: this.station.size,
        required_demand: this.demandQuantity,
        supplied_demand: this.station.supplied_demand,
        idItem: this.station.demandId,
      };

      StationDataService.create(data)
        .then((response) => {
          this.station.id = response.data.id;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newStation() {
      this.region = {};
    },

    filterFunction() {
      let filter, a, i;
      let input = document.getElementById("myInput");
      let inner = document.getElementById("inner");
      console.log(input.value);
      if (input.value != "") {
        inner.classList.remove("d-none");
      } else {
        inner.classList.add("d-none");
      }
      filter = input.value.toUpperCase();
      let div = document.getElementById("myDropdown");
      a = div.getElementsByTagName("a");
      for (i = 0; i < a.length; i++) {
        let txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "";
        } else {
          a[i].style.display = "none";
        }
      }
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 500px;
  margin: auto;
}

.item-line {
  display: flex;
  justify-content: space-between;
}

.item-line > input {
  width: 80%;
  margin-right: 5px;
}

#myInput {
  box-sizing: border-box;
  /* background-image: url("searchicon.png"); */
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 20px;
  border: none;
  border-bottom: 1px solid #ddd;
}

#myInput {
  width: 100%;
}

#myInput:focus {
  outline: 3px solid #ddd;
}

.dropdown {
  width: 100%;
  position: relative;
  display: inline-block;
}

.dropdown-content {
  background-color: #f6f6f6;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  width: 100%;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}
</style>