const FeatureRow = ({ title, imgSrc }) => (
  <div className="flex items-center space-x-2 my-1"> {/* Add vertical spacing */}
    <img src={imgSrc} alt={title} className="w-4 h-4" /> {/* Keep the check icon small */}
    <span className="text-sm font-normal">{title}</span> {/* Normal font weight */}
  </div>
);
export default FeatureRow;
