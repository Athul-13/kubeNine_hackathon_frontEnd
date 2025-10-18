const SearchContent = ({ selectedItem }) => (
  <div className="p-4 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search</h1>
    {selectedItem && <p className="text-gray-600 mt-4">Showing results for: {selectedItem}</p>}
  </div>
);

export default SearchContent;
