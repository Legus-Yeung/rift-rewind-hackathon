interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T>[];
}

/**
 * A general purpose table
 *
 * Example usage:
 * 
 *        const championStats = [
            { name: "Riven", wins: 260, losses: 399, winRate: 40 },
            { name: "Ahri", wins: 300, losses: 500, winRate: 45 },
          ];
 *
 *        <GeneralTable
            data={championStats}
            columns={[
              { key: "name", label: "Champion" },
              { key: "losses", label: "Losses" },
              { key: "wins", label: "Wins" },
              { key: "winRate", label: "Win Rate" },
            ]}
          />
 *
 * @param param0 - a {@link TableProps} with data for the chart
 * @returns a table
 */
export default function GeneralTable<T extends Record<string, any>>({
  data,
  columns,
}: TableProps<T>) {
  return (
    <table className="w-full table-auto border-collapse border border-gray-700">
      <thead>
        <tr className="bg-gray-800">
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className="border border-gray-700 px-4 py-2 text-left"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="transition hover:bg-gray-800">
            {columns.map((col) => (
              <td
                key={String(col.key)}
                className="border border-gray-700 px-4 py-2"
              >
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
