const FeatureRow = ({ title, imgSrc }) => (
  <div className="feature-row">
    <img src={imgSrc} alt={title} className="feature-icon" />
    <strong className="feature-title">{title}</strong>
  </div>
);

export default FeatureRow;
