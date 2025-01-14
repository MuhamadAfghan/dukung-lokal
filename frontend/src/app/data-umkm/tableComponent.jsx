import AutoScroll from "@/components/ui/auto-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableComponent = ({ data, selectedCategory }) => {
  const filteredData = selectedCategory
    ? data.filter((item) => item.category === selectedCategory)
    : data;

  const isTimeOpen = (openTime, closeTime) => {
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Parse opening and closing time
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    // Convert to minutes since midnight
    let currentMinutes = currentHour * 60 + currentMinute;
    const openMinutes = openHour * 60 + openMinute;
    let closeMinutes = closeHour * 60 + closeMinute;

    // If closing time is earlier than opening time, add 24 hours to closing time
    if (closeMinutes < openMinutes) {
      closeMinutes += 24 * 60;
      // If current time is after midnight, add 24 hours to current time
      if (currentMinutes < openMinutes) {
        currentMinutes += 24 * 60;
      }
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  return (
    <AutoScroll className={"max-h-[400px]"}>
      <Table className="text-xs rounded-full table-fixed sm:text-sm">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[10%] px-4 text-center">
              <span className="column-hidden-sm">Peringkat</span>
            </TableHead>
            <TableHead className="w-1/4 px-4">Nama</TableHead>
            <TableHead className="w-1/6 px-4">Produk</TableHead>
            <TableHead className="w-1/6 px-4 text-center">Like</TableHead>
            <TableHead className="w-1/2 px-4 column-hidden-md">
              Lokasi
            </TableHead>
            <TableHead className="w-1/6 px-4 column-hidden-lg">
              Jam Buka
            </TableHead>
          </TableRow>
        </TableHeader>
        {filteredData.length > 0 ? (
          <TableBody>
            {filteredData.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center">{idx + 1}</TableCell>
                <TableCell className="font-medium">{item.vendorName}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell className="text-center">
                  {item.likes ? item.likes.length : 0}
                </TableCell>
                <TableCell className="column-hidden-md">
                  {item.address}
                </TableCell>
                <TableCell className="column-hidden-lg">
                  {item.open_time.slice(0, -3)} - {item.close_time.slice(0, -3)}{" "}
                  WIB |{" "}
                  {isTimeOpen(item.open_time, item.close_time) ? (
                    <span className="text-green-400">Buka</span>
                  ) : (
                    <span className="text-red-500">Tutup</span>
                  )}
                  {/* {item} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  Sedang Mengambil data
                  <span className="loading-spiner" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </AutoScroll>
  );
};

export default TableComponent;
