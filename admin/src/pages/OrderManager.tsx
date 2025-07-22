import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, TextField, InputAdornment, useTheme, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, Snackbar,
  TableSortLabel, TablePagination, DialogContentText, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import type { SelectChangeEvent } from '@mui/material/Select'; 

// Custom Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// --- INTERFACES ---
interface OrderData {
  order_id: number;
  user_id: number;
  username: string; 
  shipping_address: string;
  payment_method: 'COD' | 'MOMO';
  payment_status: 'Chưa thanh toán' | 'Đã thanh toán';
  order_status: 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  note: string | null;
  created_at: string; 
  updated_at: string; 
}

type Order = 'asc' | 'desc';
type HeadCellId = keyof OrderData;

interface HeadCell {
  id: HeadCellId;
  label: string;
  numeric: boolean;
  disableSorting?: boolean;
}

const headCells: HeadCell[] = [
  { id: 'order_id', numeric: false, label: 'Mã Đơn' },
  { id: 'username', numeric: false, label: 'Khách hàng' },
  { id: 'payment_status', numeric: false, label: 'Thanh toán' },
  { id: 'order_status', numeric: false, label: 'Trạng thái ĐH' },
  { id: 'created_at', numeric: false, label: 'Ngày tạo' },
  { id: 'shipping_address', numeric: false, label: 'Địa chỉ', disableSorting: true },
];

// --- UTILITY FUNCTIONS FOR SORTING ---
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof OrderData>(
  order: Order,
  orderBy: Key,
): (a: OrderData, b: OrderData) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// --- ORDER MANAGER COMPONENT ---
export default function OrderManager() {
  const theme = useTheme();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); 
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<HeadCellId>('created_at'); 

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [modalFormData, setModalFormData] = useState<Partial<OrderData>>({});

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const API_URL = 'http://localhost:3000/api/orders';

  // --- API CALLS ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.');
      console.error('Fetch orders error:', err);
      showSnackbar(`Lỗi khi tải đơn hàng: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- HANDLERS ---

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  // ✅ Sửa lỗi TS6133: Tham số _event được xử lý đúng cách
  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleRequestSort = useCallback((event: React.MouseEvent<unknown>, property: HeadCellId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleEdit = useCallback((orderData: OrderData) => {
    setEditingOrder(orderData);
    setModalFormData({
      order_status: orderData.order_status,
      payment_status: orderData.payment_status,
      note: orderData.note,
    });
    setIsModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback((orderId: number) => {
    setDeletingId(orderId);
    setOpenConfirmDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    try {
      await axios.delete(`${API_URL}/${deletingId}`);
      showSnackbar('Đơn hàng đã được xóa thành công!', 'success');
      setOpenConfirmDialog(false);
      setDeletingId(null);
      fetchOrders(); 
    } catch (error) {
      showSnackbar(`Lỗi khi xóa đơn hàng: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  }, [deletingId, fetchOrders, showSnackbar]);

  const handleCloseConfirmDialog = useCallback(() => {
    setOpenConfirmDialog(false);
    setDeletingId(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setModalFormData({}); 
  }, []);

  // ✅ Sửa lỗi TS2322 cho Select và TextField
  const handleModalFormChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    
    setModalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSaveOrder = useCallback(async () => {
    if (!editingOrder) return; 
    
    try {
      await axios.put(`${API_URL}/${editingOrder.order_id}`, {
        order_status: modalFormData.order_status,
        payment_status: modalFormData.payment_status,
        note: modalFormData.note,
      });

      showSnackbar('Đơn hàng đã được cập nhật thành công!', 'success');
      handleCloseModal();
      fetchOrders(); 
    } catch (error) {
      showSnackbar(`Lỗi khi lưu đơn hàng: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  }, [editingOrder, modalFormData, handleCloseModal, fetchOrders, showSnackbar]);

  // --- MEMOIZED DATA FOR TABLE ---
  const filteredAndSortedOrders = useMemo(() => {
    let currentOrders = orders;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter((order) =>
        String(order.order_id).includes(searchTerm) ||
        order.username.toLowerCase().includes(lowerSearchTerm) ||
        order.shipping_address.toLowerCase().includes(lowerSearchTerm) ||
        order.order_status.toLowerCase().includes(lowerSearchTerm) ||
        order.payment_status.toLowerCase().includes(lowerSearchTerm)
      );
    }
     
    currentOrders = stableSort(currentOrders, getComparator(order, orderBy));

    const startIndex = page * rowsPerPage;
    return currentOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [orders, searchTerm, order, orderBy, page, rowsPerPage]);

  const totalFilteredOrders = useMemo(() => {
    let currentOrders = orders;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter((order) =>
        String(order.order_id).includes(searchTerm) ||
        order.username.toLowerCase().includes(lowerSearchTerm) ||
        order.shipping_address.toLowerCase().includes(lowerSearchTerm) ||
        order.order_status.toLowerCase().includes(lowerSearchTerm) ||
        order.payment_status.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return currentOrders.length;
  }, [orders, searchTerm]);

  // --- RENDER ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu đơn hàng...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          backgroundColor: theme.palette.background.default,
          minHeight: '50px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography color="error" variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.dark }}>
        Quản lý đơn hàng
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3], mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
          <TextField
            label="Tìm kiếm đơn hàng..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '400px' } }}
          />
        </Box>

        <TableContainer>
          <Table aria-label="order management table">
            <TableHead>
              <TableRow>
                {/* Render Header */}
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.grey[200],
                      cursor: headCell.disableSorting ? 'default' : 'pointer',
                    }}
                  >
                    {!headCell.disableSorting ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
                <TableCell align="left" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[200] }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="left" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Không tìm thấy đơn hàng nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedOrders.map((orderData) => (
                  <TableRow key={orderData.order_id} hover>
                    <TableCell align="left">{orderData.order_id}</TableCell>
                    <TableCell align="left">{orderData.username}</TableCell>
                    <TableCell align="left">{orderData.payment_status}</TableCell>
                    <TableCell align="left">{orderData.order_status}</TableCell>
                    <TableCell align="left">{format(new Date(orderData.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell align="left" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {orderData.shipping_address}
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', justifyContent: 'left', gap: 1 }}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={() => handleEdit(orderData)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDeleteConfirm(orderData.order_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalFilteredOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Modal Chỉnh sửa Đơn hàng */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm" scroll="paper">
        <DialogTitle>
          Chỉnh sửa Đơn hàng #{editingOrder?.order_id}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {editingOrder && (
              <>
                <Typography variant="subtitle1">
                  <strong>Khách hàng:</strong> {editingOrder.username}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Địa chỉ:</strong> {editingOrder.shipping_address}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Phương thức TT:</strong> {editingOrder.payment_method}
                </Typography>

                {/* Select Trạng thái đơn hàng */}
                <FormControl fullWidth>
                  <InputLabel id="order-status-label">Trạng thái đơn hàng</InputLabel>
                  <Select
                    labelId="order-status-label"
                    name="order_status"
                    label="Trạng thái đơn hàng"
                    value={modalFormData.order_status || 'Chờ xác nhận'}
                    onChange={handleModalFormChange}
                  >
                    <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                    <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                    <MenuItem value="Đang giao">Đang giao</MenuItem>
                    <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                  </Select>
                </FormControl>

                {/* Select Trạng thái thanh toán */}
                <FormControl fullWidth>
                  <InputLabel id="payment-status-label">Trạng thái thanh toán</InputLabel>
                  <Select
                    labelId="payment-status-label"
                    name="payment_status"
                    label="Trạng thái thanh toán"
                    value={modalFormData.payment_status || 'Chưa thanh toán'}
                    onChange={handleModalFormChange}
                  >
                    <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
                    <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Ghi chú"
                  name="note"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={modalFormData.note || ''}
                  onChange={handleModalFormChange}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveOrder}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa đơn hàng?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa đơn hàng này? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}