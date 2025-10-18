const DMsContent = ({ selectedItem }) => (
  <div className="p-4 md:p-8">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Direct Messages</h1>
    {selectedItem && <p className="text-gray-600 mt-4">Viewing conversation: {selectedItem}</p>}
  </div>
);

export default DMsContent;
