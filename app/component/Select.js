import React, { useState } from "react";
import { Select } from "antd";

const SelectOne = ({ options, value, setValue }) => {
  const [currentOptions, setCurrentOptions] = useState(options);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (inputValue) => {
    setSearchValue(inputValue);
  };

  const handleAddOption = () => {
    const newOption = { label: searchValue, value: searchValue };
    setCurrentOptions([newOption, ...currentOptions]); // Thêm vào đầu danh sách
    setValue(searchValue);
    setSearchValue(""); // Clear search input
  };

  return (
    <Select
      showSearch
      placeholder="Search to Select"
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      value={value}
      onChange={(val) => setValue(val)}
      options={currentOptions}
      onSearch={handleSearch}
      dropdownRender={(menu) => (
        <>
          {searchValue &&
            !currentOptions.some((option) => option.value === searchValue) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Căn giữa
                  alignItems: "center", // Căn giữa
                  padding: 8,
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddOption();
                }}
              >
                Add "{searchValue}"
              </div>
            )}
          {menu}
        </>
      )}
    />
  );
};

export default SelectOne;
