import { Table } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "next/link";

function EPLTable({ data }) {
  return (
    <div>
      <Link href="/">Back to player directory</Link>
      <h1 style={{ textAlign: "center" }}>EPL Table</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Team Badge</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>Played</TableCell>
              <TableCell>Won</TableCell>
              <TableCell>Drawn</TableCell>
              <TableCell>Lost</TableCell>
              <TableCell>GF</TableCell>
              <TableCell>GA</TableCell>
              <TableCell>GD</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.overall_league_position}>
                <TableCell component="th" scope="row">
                  {row.overall_league_position}
                </TableCell>
                <TableCell>
                  <img src={row.team_badge} />
                </TableCell>
                <TableCell>{row.team_name}</TableCell>
                <TableCell>{row.overall_league_payed}</TableCell>
                <TableCell>{row.overall_league_W}</TableCell>
                <TableCell>{row.overall_league_D}</TableCell>
                <TableCell>{row.overall_league_L}</TableCell>
                <TableCell>{row.overall_league_GF}</TableCell>
                <TableCell>{row.overall_league_GA}</TableCell>
                <TableCell>
                  {row.overall_league_GF - row.overall_league_GA}
                </TableCell>
                <TableCell>{row.overall_league_PTS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    `https://apiv2.apifootball.com/?action=get_standings&league_id=148&APIkey=YOUR-API-KEY`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default EPLTable;
