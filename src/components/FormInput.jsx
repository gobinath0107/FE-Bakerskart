const FormInput = ({ label, name, type, defaultValue, size, defaultChecked }) => {
  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      {type === "checkbox" ? (
          <input
            id={name}
            name={name}
            type="checkbox"
            value="true"
            defaultChecked={defaultChecked}
            className="checkbox checkbox-primary ml-2"
          />
        ) : (
          <input
            type={type}
            name={name}
            defaultValue={defaultValue}
            className={`input input-bordered ${size}`}
          />
        )}
    </div>
  );
};
export default FormInput;
