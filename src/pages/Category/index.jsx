import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  InputAdornment,
  Button,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@mui/styles";
import { Search } from "@mui/icons-material";
import { saveAs } from "file-saver";
import axios from "axios";
import Input from "../../components/controls/Input";
import CircularProgress from "../../components/controls/circular";
import SelectFilter from "../../components/controls/filter";
import TablePaginationActions from "../../components/controls/pagination";
import Loading from "../../components/controls/loading";
// import Dialog from "../../components/controls/dialog";
import "./styles.scss";

const SEVER_URL = "http://localhost:8080";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "35%",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const [headCells, setHeadCells] = React.useState([]);
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  React.useEffect(() => {
    let head = [];
    props.inputRows[0] &&
      Object.keys(props.inputRows[0]).forEach((item) => {
        item !== "_id" &&
          item !== "createdAt" &&
          item !== "updatedAt" &&
          item !== "__v" &&
          head.push({
            id: item,
            disablePadding: true,
            label: item,
          });
      });
    setHeadCells(head);
  }, [props]);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [inputRows, setInputRows] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState("none");
  const [heads, setHeads] = React.useState([]);

  React.useEffect(() => {
    setLoading("flex");
    axios.get(`${SEVER_URL}/catagory`).then((res) => {
      setRows(res.data);
      setLoading("none");
    });
  }, []);

  React.useEffect(() => {
    setRows(inputRows);
  }, [inputRows]);

  React.useEffect(() => {
    setHeads(rows.length ? Object.keys(rows[0]) : []);
  }, [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleImport = async (event) => {
    setLoading("flex");
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${SEVER_URL}/catagory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInputRows(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading("none");
  };

  const handleExport = () => {
    setLoading("flex");
    axios
      .get(`${SEVER_URL}/files/download`, {
        responseType: "blob",
      })
      .then((response) => {
        saveAs(
          new Blob([response.data], { type: response.data.type }),
          "catagory.xlsx"
        );
      });
    setLoading("none");
  };

  const handleSearch = (e) => {};

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );
  const searchNiche = ["erre", "dfwe", "eeee"];
  const searchLinkType = ["testlink1", "testlink2", "testlink3"];
  const searchLanguage = ["Eng", "spa", "turki"];
  const searchSideBar = ["test1", "test2", "test3"];
  const searchSports = ["erre", "dfwe", "eeee"];
  const searchPharm = ["errewwwww", "dfwewwwwwwwwww", "eeeewww"];
  return (
    <Box>
      <Loading loading={loading} setLoading={setLoading}></Loading>
      <Box sx={{ width: "100%", padding: "20px" }}>
        <SelectFilter text="Niche" items={searchNiche}></SelectFilter>
        <SelectFilter text="Link Type" items={searchLinkType}></SelectFilter>
        <SelectFilter text="Language" items={searchLanguage}></SelectFilter>
        <SelectFilter text="Sidebar" items={searchSideBar}></SelectFilter>
        <SelectFilter text="Sports" items={searchSports}></SelectFilter>
        <SelectFilter text="Pharmacy" items={searchPharm}></SelectFilter>
        <Box className="d-flex">
          <Toolbar>
            <Input
              label="Search"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
          </Toolbar>
          <Box className="btn_group">
            <Button
              variant="contained"
              component="label"
              color="info"
              onChange={handleImport}
            >
              Import File
              <input type="file" hidden />
            </Button>
            <Button
              variant="contained"
              component="label"
              color="info"
              onClick={handleExport}
            >
              Export File
            </Button>
          </Box>
        </Box>
        {/* <Dialog open={open} setOpen={setOpen}></Dialog> */}

        {/* <Paper sx={{ width: "100%", overflow: "hidden" }}> */}
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table
            style={{ borderCollapse: "collapse" }}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              inputRows={rows}
            />
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow
                  tabIndex={-1}
                  key={index}
                  selected={index % 2 === 0 ? true : false}
                  sx={{ cursor: "pointer" }}
                  hover={false}
                >
                  {heads.map((item, index) =>
                    item === "DA" ? (
                      <TableCell key={index}>
                        <CircularProgress
                          progress={row[item]}
                          color="primary"
                          key={index}
                        />
                      </TableCell>
                    ) : item === "Price" ? (
                      <TableCell key={index}>
                        {row[item] ? `$${row[item]}` : "sd"}
                      </TableCell>
                    ) : item === "Domain Rating" ? (
                      <TableCell key={index}>
                        <CircularProgress
                          progress={row[item]}
                          color="secondary"
                          key={index}
                        />
                      </TableCell>
                    ) : (
                      item !== "_id" &&
                      item !== "createdAt" &&
                      item !== "updatedAt" &&
                      item !== "__v" && (
                        <TableCell key={index}>
                          {row[item] ? row[item] : ""}
                        </TableCell>
                      )
                    )
                  )}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Paper> */}
        <TablePagination
          rowsPerPageOptions={[30, 40, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Box>
    </Box>
  );
}
