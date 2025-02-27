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
