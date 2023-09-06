const Filter = ({ handleFilterChange, handleBackSpace }) => {
  return (
    <div>
      filter shown with <input onChange={handleFilterChange} onKeyDown={(e) => {
        if (e.key === "Backspace") {
          handleBackSpace()
        }
      }} />
    </div>
  )
}

export default Filter