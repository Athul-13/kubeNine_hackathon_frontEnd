const HomeContent = ({ selectedItem }) => (
  <div className="p-4 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Home</h1>
    {selectedItem && <p className="text-gray-600 mt-4">Selected: {selectedItem}</p>}
  </div>
);

export default HomeContent;
