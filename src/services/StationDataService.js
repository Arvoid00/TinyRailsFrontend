import http from "../http-common";

class StationDataService {
  getAll() {
    return http.get("/stations");
  }

  get(id) {
    return http.get(`/stations/${id}`);
  }

  create(data) {
    return http.post("/stations", data);
  }

  update(id, data) {
    return http.put(`/stations/${id}`, data);
  }

  delete(id) {
    return http.delete(`/stations/${id}`);
  }

  deleteAll() {
    return http.delete(`/stations`);
  }

  findByTitle(name) {
    return http.get(`/stations?name=${name}`);
  }

  getStationsByRegion(idRegion) {
    return http.get(`/stations?region=${idRegion}`);
  }
}

export default new StationDataService();
