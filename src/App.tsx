import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormData {
  country: string;
  state: string;
  city: string;
}

const App: React.FC = () => {
  const[country,setCountry]=useState("");
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      country: "",
      state: "",
      city: "",
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/positions"
      );
      const countryOptions = response.data.data.map((country: { name: string }) => ({
        value: country.name.toLowerCase(),
        label: country.name,
      }));
      setCountries(countryOptions);
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    const response = await axios.post(
      `https://countriesnow.space/api/v0.1/countries/states`,
      { country: selectedCountry }
    );
    const stateOptions = response.data.data.states.map((name: any) => ({
      value: name.name.toLowerCase(),
      label: name.name,
    }));
    setStates(stateOptions);
    setCities([]);
  };

  const handleStateChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = event.target.value;
    setValue("state", selectedState);
    const response = await axios.post(
      `https://countriesnow.space/api/v0.1/countries/state/cities`,
      { country: country, state: selectedState }
    );
    const cityOptions = response.data.data.map((name: string) => ({
      value: name.toLowerCase(),
      label: name,
    }));
    setCities(cityOptions);
  };

  return (
    <div>
      <form onSubmit={handleSubmit((data: FormData) => console.log(data))}>
        <label htmlFor="country">Country</label>
        <select id="country" {...register("country")} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="state">State</label>
        <select id="state" {...register("state")} onChange={handleStateChange}>
          <option value="">Select a state</option>
          {states.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="city">City</label>
        <select id="city" {...register("city")}>
          <option value="">Select a city</option>
          {cities.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
