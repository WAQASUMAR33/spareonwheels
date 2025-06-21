import { useState, useEffect } from "react";
import { FaSearch, FaCarSide } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const [subcategories, setSubcategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedMake, setSelectedMake] = useState('Any');
  const [selectedModel, setSelectedModel] = useState('Any');
  const [selectedYear, setSelectedYear] = useState('Any');
  const [SearchText, setSearchText] = useState('');
  const [type, settype] = useState('Any');

  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    console.log("Filtereed Modelsa are: ", filteredModels);
    if (selectedMake) {
      console.log("new product is", selectedMake.makeId);
      console.log("All models : ", models);

      setFilteredModels(models.filter((model) => model.makeId == selectedMake));

      console.log("Filtered models are: ", models.filter((model) => model.makeId == selectedMake));
    } else {
      setFilteredModels([]); // Clear if no make is selected
    }
  }, [selectedMake, models]);

  const router = useRouter();
  useEffect(() => {
    if (selectedMake && selectedModel) {
      console.log("SelectedMaker",selectedMake,"SelectedModel",selectedModel);
      axios.get(`/api/getyearfrommakemade/${selectedMake}/${selectedModel}`)
  .then(response => {
    if (response.data.length === 1 && response.data[0].id === "Any") {
      setYears(response.data);
      console.log("No product found",response.data);
    } else {
      // Handle the case where years are found
      setYears(response.data);
    }
  })
  .catch(error => console.error("Error fetching years:", error));

    }
  }, [selectedMake, selectedModel]);

  useEffect(() => {
    // Fetch subcategories
    axios.get('/api/subcategories')
      .then(response => setSubcategories(response.data.data))
      .catch(error => console.error("Error fetching subcategories:", error));

    // Fetch makes (brands)
    axios.get('/api/make')
      .then(response => setMakes(response.data))
      .catch(error => console.error("Error fetching makes:", error));

    // Fetch models
    axios.get('/api/model')
      .then(response => setModels(response.data))
      .catch(error => console.error("Error fetching models:", error));

    // Fetch years
    axios.get('/api/year')
    .then(response => {
   console.log("All years are: ",response.data);
        // Handle the case where years are found
        setYears(response.data);
      
    })
      .catch(error => console.error("Error fetching years:", error));
  }, []);

  const handleSearch = () => {
    const query = new URLSearchParams({
      searchtext: SearchText,
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      type: type,
    }).toString();
    router.push(`/product/search?${query}`);
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
  }
  const setProductType = (newtype) => {
    settype(newtype);
  }

  return (
    <div className="md:h-[108vh] bg-[url('/herosection/herosection.jpeg')] bg-cover bg-center text-center text-white py-6 md:py-20">
      <h2 className="text-base md:text-lg font-light mb-2">Find auto parts for every car</h2>
      <h1 className=" text-3xl md:text-5xl font-bold mb-6">Find Perfect Parts</h1>

      <div className="flex justify-center space-x-8 text-sm md:text-lg font-semibold mb-6 ">
        <button
          onClick={() => setProductType('Any')}
          className={`pb-1 ${type === 'Any' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
        >
          All
        </button>
        <button
          onClick={() => setProductType('New')}
          className={`pb-1 ${type === 'New' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
        >
          New
        </button>
        <button
          onClick={() => setProductType('Used')}
          className={`pb-1 ${type === 'Used' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
        >
          Used
        </button>
      </div>

      {/* Search Filters */}
      <div className="flex justify-center items-center md:border md:pt-10 pb-4 mb-6 md:max-w-[1100px] md:bg-white/20 mx-auto">
        <div className="flex  pb-4 md:pb-0 gap-4 md:gap-0 flex-col md:flex-row justify-center items-center space-x-4 bg-white/50  md:bg-white rounded-lg mx-auto shadow-lg ">
          <div className=" w-full bg-white rounded py-4 px-4 md:px-6 flex flex-col md:flex-row items-center space-x-4">
            <div className="w-full flex flex-col justify-center px-2 md:px-0 relative">
              <label className="text-gray-700 text-left visible md:absolute md:-top-[55px]  md:-left-5 md:text-white mb-2 mt-2">
                Search
              </label>
              <input
                type="text"
                value={SearchText}
                onChange={handleSearchChange}
                className="md:w-48 w-64 bg-gray-100 md:bg-transparent md:border-0 border border-gray-300 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400"
                placeholder="Search..."
              />
            </div>

            <div className="hidden md:visible h-10 border-l border-gray-800"></div>
            <div className="w-full flex flex-col justify-start items-start relative">
              <label className="text-gray-700 text-left visible md:absolute md:-top-[57px]  md:-left-0 md:text-white mb-2 mt-2">
                Manufacture
              </label>
              <select className="md:w-48 w-64 bg-gray-100 md:bg-transparent md:border-0 border border-gray-300 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400" onChange={(e) => setSelectedMake(e.target.value)}>
                <option value='Any'>Manufacture</option>
                {makes.map((make, index) => (
                  <option key={index} value={make.id}>
                    {make.make}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:visible h-10 border-l border-gray-800"></div>
            <div className="w-full flex flex-col justify-start relative">
              <label className="text-gray-700 text-left visible md:absolute md:-top-[57px] md:-left-0 md:text-white mb-2 mt-2">
                Model
              </label>
              <select className="md:w-48 w-64 bg-gray-100 md:bg-transparent md:border-0 border border-gray-300 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400" onChange={(e) => setSelectedModel(e.target.value)}>
                <option value='Any'>Models</option>
                {filteredModels.map((model, index) => (
                  <option key={index} value={model.id}>
                    {model.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:visible h-10 border-l border-gray-800"></div>
            <div className="w-full flex flex-col justify-start relative">
              <label className="text-gray-700 text-left visible md:absolute md:-top-[57px] md:-left-0 md:text-white mb-2 mt-2">
                Year
              </label>
              <select className="md:w-48 w-64 bg-gray-100 md:bg-transparent md:border-0 border border-gray-300 text-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400" onChange={(e) => setSelectedYear(e.target.value)}>
                <option value='Any'>Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>

            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <button onClick={handleSearch} className="flex items-center bg-[#FF0000] text-white py-2 md:py-6 xl:py-6 px-4 md:px-6 rounded-lg font-semibold">
              <FaSearch className="mr-2" /> Search Parts
            </button>
          </div>
        </div>
      </div>

      {/* Browse Options */}
      <p className="text-white mb-4">Or Browse Spare parts</p>
      <div className="flex justify-center flex-wrap gap-1 md:gap-4">
        {makes.map((make) => (
          <Link href={`/filteredproducts?make=${make.make}&id=${make.id}`}>
            <button
              key={make.id}
              className="flex text-base items-center bg-white text-gray-700 py-1 md:py-2 md:px-4 px-2 rounded-full shadow"
              onClick={() => router.push(`/product/search?make=${make.id}`)}
            >
              <FaCarSide className="mr-2" /> {make.make}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
