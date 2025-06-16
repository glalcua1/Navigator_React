import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function MyEventsHolidaysTable() {
  const data = [
    {
      name: "🇬🇧 Battle of the Boyne (in lieu) (Regional Holiday)",
      dates: "Mon 14 Jul",
      distance: "--",
      visitors: "--",
    },
    { name: "🇮🇳 Behdiekhlam (Regional Holiday)", dates: "Mon 14 Jul", distance: "--", visitors: "--" },
  ]

  return (
    <Card className="bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          My events / holidays
          <Badge variant="secondary" className="ml-2 text-xs font-normal">
            2 accepted
          </Badge>
        </CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          See suggested events
        </a>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead className="w-[150px]">Dates</TableHead>
              <TableHead className="w-[150px]">Distance to hotel</TableHead>
              <TableHead>Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.dates}</TableCell>
                <TableCell>{row.distance}</TableCell>
                <TableCell>{row.visitors}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
