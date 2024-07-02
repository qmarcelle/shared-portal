import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import SearchIcon from '../../../public/assets/Search.svg';

interface Props {
  onSearch: (searchTerm: string) => void;
  hint: string;
}

const SearchField: React.FC<Props> = ({ onSearch, hint }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = () => {
    onSearch(searchTerm);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value == '') {
      onSearch(event.target.value);
    } else {
      onSearch(searchTerm);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const [focus, setFocus] = useState(false);
  const [focusButton, setFocusButton] = useState(false);

  return (
    <div
      className={`flex flex-row items-center input ${focus ? 'input-focus' : ''} `}
    >
      <input
        className="body-1 search-textfield"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={handleChange}
        value={searchTerm}
        placeholder={hint}
        type="text"
        onKeyDown={_handleKeyDown}
      />
      <div className="flex flex-col items-end">
        <button
          type="submit"
          className={`flex flex-col ${focusButton ? 'buttonSearch-focus' : ''} `}
          onClick={handleSubmit}
          onFocus={() => setFocusButton(true)}
          onBlur={() => setFocusButton(false)}
        >
          <Image src={SearchIcon} className="icon searchhover " alt="Search" />
        </button>
      </div>
    </div>
  );
};

export default SearchField;
