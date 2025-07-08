
export async function fetchMakes() {
  try {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
    const data = await response.json();
    return data.Results.map(item => ({ label: item.Make_Name, value: item.Make_Name }));
  } catch (error) {
    console.error('Error fetching makes:', error);
    return [];
  }
}

export async function fetchModels(make) {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`);
    const data = await response.json();
    return data.Results.map(item => ({ label: item.Model_Name, value: item.Model_Name }));
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}
