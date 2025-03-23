import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

export default function Selector({ items, onChange, name }) {
  const multiSelectRef = useRef();
  const [selectedItem, setSelectedItem] = useState([]);

  function updateSelector(e, name) {
    setSelectedItem(e);
    onChange(e, name);
  }

  return (
    <View>
      <MultiSelect
        hideTags
        items={items.map((item) => ({
          id: item,
          name: item,
        }))}
        uniqueKey="id"
        ref={multiSelectRef}
        onSelectedItemsChange={(e) => updateSelector(e, name)}
        selectedItems={selectedItem}
        searchInputPlaceholderText="Select Customer want to visit"
        onChangeInput={(text) => console.log(text)}
        tagRemoveIconColor="#355F2E"
        tagBorderColor="#355F2E"
        tagTextColor="#355F2E"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#CCC', padding: 10 }}
        submitButtonColor="#355F2E"
        submitButtonText="Submit"
        styleSelectorContainer={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#d4d4d4",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
        // nestedScrollEnabled // Ensure the nested scroll functionality works correctly
      />
    </View>
  );
}
