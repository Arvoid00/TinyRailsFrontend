<template>
  <div class="submit-form">
    <h1>Add a new Region</h1>
    <div v-if="!submitted">
      <div class="form-group">
        <label for="title">Name</label>
        <input
          type="text"
          class="form-control"
          id="title"
          required
          v-model="region.name"
          name="title"
        />
      </div>

      <button @click="saveRegion" class="btn btn-success">Submit</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newRegion">Add</button>
    </div>
  </div>
</template>

<script>
import RegionDataService from "../services/RegionDataService";

export default {
  name: "add-region",
  data() {
    return {
      name: "",
      submitted: false,
      region: {
        id: null,
        name: "",
      },
    };
  },
  methods: {
    saveRegion() {
      var data = {
        title: this.region.name,
      };

      RegionDataService.create(data)
        .then((response) => {
          this.region.id = response.data.id;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newRegion() {
      this.region = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 500px;
  margin: auto;
}
</style>