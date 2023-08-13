  //Format for chart = [
  // {
  //   "id": "japan",
  //   "color": "hsl(92, 70%, 50%)",
  //   "data": [
  //     {
  //       "x": "plane",
  //       "y": 264
  //     },
  //     {
  //       "x": "helicopter",
  //       "y": 31
  //     },
  // row format:
  // [
  //   { year: 2022, country: 'USA', total_population: 333288000 },

export const convertDataForChart = (data, code) => {
  console.log("Transform data for chart");
  const dataForChartFormat = []
  // list of years
  const years = [...new Set(data.map(a => a.year))].sort();
  // list of countries
  const countries = [...new Set(data.map(a => a.country))].sort();

  //parse
  countries.map((country)=>{
    const add = {"id" : country, "data": []}
    years.map((year)=>{
      const value = data.filter((x) => { return (x["year"] === year && x["country"]===country)})[0][code];
      add["data"].push({"x": year, "y": value});
    })
    dataForChartFormat.push(add);
  })
  console.log(dataForChartFormat)

  return dataForChartFormat
}