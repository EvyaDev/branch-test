import Logo from "./Assest/mc_logo.png"
import { useState, useEffect } from "react";
import './STYLE/App.css';
import './STYLE/responsive.css';

function App() {
  const [stores, setStores] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCiteis] = useState([]);
  const [branches, setBranches] = useState([]);
  const [city, setCity] = useState("");

  //PAGE IS LOADING 
  useEffect(() => {
    Promise.all([
      fetch("/stores.json")
        .then(res => res.json())
        .catch(err => console.error(err))
      ,
      fetch("/regionsNames.json")
        .then(res => res.json())
        .catch(err => console.error(err))
    ])
      .then(data => {
        const [stores, regionsNames] = data;
        setRegions(regionsNames);
        setStores(stores);
        setBranches(stores);
      })
      .catch(err => console.error(err));

  }, []);


  // SELECT REGION
  function handleRegionChange(ev) {
    const regionsIdList = ev.target.value;
    const numbersArray = regionsIdList.split(",").map(Number);

    const citiesFilter = stores.filter(store => numbersArray.includes(+store.store_region))
      .map(store => store.city.trim())
      .filter((val, i, self) => self.indexOf(val) === i)

    setCiteis(citiesFilter);
    setBranches(stores.filter(store => numbersArray.includes(+store.store_region) || regionsIdList === "בחר אזור"));
  }


  // SELECT CITY
  function handleCityChange(ev) {
    const newCity = ev.target.value;
    setCity(newCity);
    setBranches(stores.filter(x => x.city.trim() === newCity || newCity === "בחר עיר"));
  }


  // CUSTOM TEXT SEARCH
  function handleInputChange(ev) {
    const input = ev.target.value;

    setBranches(stores.filter(x =>
      x.city.trim().includes(input) ||
      x.store_title.trim().includes(input) ||
      x.store_address.trim().includes(input)
    ))
    resetSelections();
  }

  function resetSelections() {
    setCity("");
    setCiteis([]);
  }

  return (
    <div className='App'>

      <img alt="logo" className='logo' src={Logo}></img>
      <h1>סניפי McDonald's </h1>

      {/* Filters */}
      <div className='filters-area'>

        <span>סינון:</span>

        <select className='filter-region' onChange={handleRegionChange}>
          <option >בחר אזור</option>
          {regions.map(region => {
            return (
              <option key={Object.values(region)} value={Object.values(region)}>{Object.keys(region)}</option>
            )
          })}
        </select>

        <select className='filter-city' onChange={handleCityChange}>
          <option >בחר עיר</option>
          {cities.map(city => {
            return <option key={city} value={city}>{city}</option>
          })}
        </select>

        <input placeholder='חיפוש חופשי' onChange={handleInputChange}></input>
      </div>

      {/* Table */}
      {branches.length ?

        <div className='branches-table'>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>שם הסניף</th>
                <th>כתובת</th>
                <th>טלפון הסניף</th>
                <th></th>
                <th> פרטים</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((store, i) => {
                return (
                  <tr key={store.store_id}>
                    <td>{i + 1}.</td>
                    <td className='title'>
                      <p>{store.store_title}</p>
                      <span>({store.city.trim()})</span>
                    </td>
                    <td>{store.store_address}</td>
                    <td className="phone"><a href={`tel:${store.store_phone}`}>{store.store_phone}</a></td>
                    <td className="navigate"><a target="_blank" href={`https://google.com/maps?q=${store.gps_location}`}>ניווט</a></td>
                    <td className='emp_interview'>{store.emp_interview}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        : <p>אין תוצאות</p>}
    </div>
  );
}

export default App;