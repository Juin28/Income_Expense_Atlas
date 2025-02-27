// // Currency selector component
// export default function CurrencySelector() {
//     const currencies = [
//         { code: 'USD', name: 'US Dollar', flag: '/api/placeholder/20/15' },
//         { code: 'EUR', name: 'Euro', flag: '/api/placeholder/20/16' },
//         { code: 'GBP', name: 'British Pound', flag: '/api/placeholder/20/17' },
//         { code: 'JPY', name: 'Japanese Yen', flag: '/api/placeholder/20/18' },
//         { code: 'AUD', name: 'Australian Dollar', flag: '/api/placeholder/20/19' },
//         { code: 'CAD', name: 'Canadian Dollar', flag: '/api/placeholder/20/20' },
//         { code: 'CHF', name: 'Swiss Franc', flag: '/api/placeholder/20/21' },
//         { code: 'CNY', name: 'Chinese Yuan', flag: '/api/placeholder/20/22' },
//         { code: 'SEK', name: 'Swedish Krona', flag: '/api/placeholder/20/23' },
//         { code: 'NZD', name: 'New Zealand Dollar', flag: '/api/placeholder/20/24' },
//     ];

//     const [selectedCurrency, setSelectedCurrency] = React.useState(currencies[0]);

//     const handleCurrencyChange = (currency) => {
//         setSelectedCurrency(currency);
//     };

//     return (
//         <div className="absolute top-4 right-4">
//             <button className="bg-white rounded-md px-4 py-2 flex items-center space-x-2">
//                 <img src={selectedCurrency.flag} alt={`${selectedCurrency.name} Flag`} className="w-5 h-3" />
//                 <span className="text-black">{selectedCurrency.code}</span>
//                 <span className="text-black">▼</span>
//             </button>
//             <div className="absolute mt-2 bg-white rounded-md shadow-lg">
//                 {currencies.map((currency) => (
//                     <button
//                         key={currency.code}
//                         className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
//                         onClick={() => handleCurrencyChange(currency)}
//                     >
//                         <img src={currency.flag} alt={`${currency.name} Flag`} className="w-5 h-3" />
//                         <span className="text-black">{currency.code}</span>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currencies = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'JPY', flag: '🇯🇵' },
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'CAD', flag: '🇨🇦' }
];

export default function CurrencySelector () {
  const [selectedCurrency, setSelectedCurrency] = React.useState('USD');

  return (
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white rounded-md px-4 py-2 flex items-center space-x-2">
          <span className="text-lg">{currencies.find(c => c.code === selectedCurrency)?.flag}</span>
          <span className="text-black">{selectedCurrency}</span>
          <span className="text-black">▼</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white rounded-md mt-1">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-lg">{currency.flag}</span>
              <span className="text-black">{currency.code}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
