import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, TextField, InputAdornment, useTheme, Switch, FormControlLabel,
  TableSortLabel, TablePagination, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// --- MOCK DATA & INTERFACES ---
interface Voucher {
  id: string;
  code: string;
  name: string;
  value: number;
  type: 'percentage' | 'fixed_amount';
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Expired';
}

const initialVouchers: Voucher[] = [
  { id: 'V001', code: 'SALE20', name: 'Giảm giá 20% tháng 6', value: 20, type: 'percentage', expiryDate: '2025-06-30', status: 'Active' },
  { id: 'V002', code: 'FREESHIP', name: 'Miễn phí vận chuyển', value: 0, type: 'fixed_amount', expiryDate: '2025-07-15', status: 'Active' },
  { id: 'V003', code: 'SUMMER100', name: 'Giảm 100k cho đơn hàng', value: 100000, type: 'fixed_amount', expiryDate: '2025-08-01', status: 'Active' },
  { id: 'V004', code: 'EXPIRED_VOUCHER', name: 'Voucher đã hết hạn', value: 10, type: 'percentage', expiryDate: '2024-12-31', status: 'Expired' },
  { id: 'V005', code: 'NEWUSER50', name: 'Giảm 50k cho khách mới', value: 50000, type: 'fixed_amount', expiryDate: '2025-09-30', status: 'Active' },
  { id: 'V006', code: 'INACTIVE_VOUCHER', name: 'Voucher không hoạt động', value: 15, type: 'percentage', expiryDate: '2025-10-20', status: 'Inactive' },
  { id: 'V007', code: 'VIP200', name: 'Voucher cho khách VIP', value: 200000, type: 'fixed_amount', expiryDate: '2025-11-01', status: 'Active' },
];

type Order = 'asc' | 'desc';
type HeadCellId = keyof Voucher;

interface HeadCell {
  id: HeadCellId;
  label: string;
  numeric: boolean;
  disableSorting?: boolean;
}

const headCells: HeadCell[] = [
  { id: 'code', numeric: false, label: 'Mã Voucher' },
  { id: 'name', numeric: false, label: 'Tên Voucher' },
  { id: 'value', numeric: true, label: 'Giá trị' },
  { id: 'expiryDate', numeric: false, label: 'Ngày hết hạn' },
  { id: 'status', numeric: false, label: 'Trạng thái' },
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

function getComparator<Key extends keyof Voucher>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
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

// --- VOUCHER MANAGER COMPONENT ---
export default function VoucherManager() {
  const theme = useTheme();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // State cho sắp xếp
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<HeadCellId>('code');

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>('');

  // State cho Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null); // Null khi thêm mới, Voucher object khi chỉnh sửa
  const [modalFormData, setModalFormData] = useState<Partial<Voucher>>({}); // Dữ liệu form trong modal

  // --- MOCK API CALL ---
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setVouchers(initialVouchers); // Load mock data
      } catch (err) {
        setError('Không thể tải dữ liệu voucher. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  // --- HANDLERS ---

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleRequestSort = useCallback((event: React.MouseEvent<unknown>, property: HeadCellId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleStatusChange = useCallback((voucherId: string) => {
    setVouchers((prevVouchers) =>
      prevVouchers.map((voucher) =>
        voucher.id === voucherId
          ? {
            ...voucher,
            status: voucher.status === 'Active' ? 'Inactive' : 'Active', // Toggle Active/Inactive
          }
          : voucher
      )
    );
  }, []);

  const handleAddNewVoucher = useCallback(() => {
    setEditingVoucher(null); // Báo hiệu là thêm mới
    setModalFormData({ type: 'fixed_amount', status: 'Active' }); // Giá trị mặc định
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((voucher: Voucher) => {
    setEditingVoucher(voucher); // Đặt đối tượng voucher để chỉnh sửa
    setModalFormData(voucher); // Load dữ liệu voucher vào form
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((voucherId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa voucher ${voucherId}?`)) {
      setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== voucherId));
      console.log(`Đã xóa voucher với ID: ${voucherId}`);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingVoucher(null);
    setModalFormData({}); // Reset form data
  }, []);

  const handleModalFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value, // Chuyển đổi giá trị thành số
    }));
  }, []);

  const handleSaveVoucher = useCallback(() => {
    // Validate form data here if needed
    if (!modalFormData.code || !modalFormData.name || !modalFormData.expiryDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    if (editingVoucher) {
      // Logic cập nhật voucher hiện có
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) => (voucher.id === editingVoucher.id ? { ...editingVoucher, ...modalFormData } as Voucher : voucher))
      );
      console.log('Cập nhật voucher:', { ...editingVoucher, ...modalFormData });
    } else {
      // Logic thêm voucher mới
      const newId = `V${String(vouchers.length + 1).padStart(3, '0')}`;
      const newVoucher = { ...modalFormData, id: newId } as Voucher;
      setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
      console.log('Thêm voucher mới:', newVoucher);
    }
    handleCloseModal();
  }, [editingVoucher, modalFormData, vouchers, handleCloseModal]);

  // --- MEMOIZED DATA FOR TABLE ---
  const filteredAndSortedVouchers = useMemo(() => {
    let currentVouchers = vouchers;

    if (searchTerm) {
      currentVouchers = currentVouchers.filter((voucher) =>
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    currentVouchers = stableSort(currentVouchers, getComparator(order, orderBy));

    const startIndex = page * rowsPerPage;
    return currentVouchers.slice(startIndex, startIndex + rowsPerPage);
  }, [vouchers, searchTerm, order, orderBy, page, rowsPerPage]);

  const totalFilteredVouchers = useMemo(() => {
    let currentVouchers = vouchers;
    if (searchTerm) {
      currentVouchers = currentVouchers.filter((voucher) =>
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return currentVouchers.length;
  }, [vouchers, searchTerm]);

  const getStatusChipColor = (status: 'Active' | 'Inactive' | 'Expired') => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const formatVoucherValue = (voucher: Voucher) => {
    if (voucher.type === 'percentage') {
      return `${voucher.value}%`;
    } else {
      return `${voucher.value.toLocaleString('vi-VN')} VND`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu voucher...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.dark }}>
        Quản Lý Voucher
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3], mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
          <TextField
            label="Tìm kiếm voucher..."
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
            sx={{ width: { xs: '100%', sm: '300px' } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNewVoucher}
            sx={{ flexShrink: 0 }}
          >
            Thêm Voucher Mới
          </Button>
        </Box>

        <TableContainer>
          <Table aria-label="voucher management table">
            <TableHead>
              <TableRow>
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
                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[200] }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Không tìm thấy voucher nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedVouchers.map((voucher) => (
                  <TableRow key={voucher.id} hover>
                    <TableCell>{voucher.code}</TableCell>
                    <TableCell>{voucher.name}</TableCell>
                    <TableCell align="right">{formatVoucherValue(voucher)}</TableCell>
                    <TableCell>{voucher.expiryDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={voucher.status === 'Active' ? 'Hoạt động' : (voucher.status === 'Inactive' ? 'Không hoạt động' : 'Hết hạn')}
                        color={getStatusChipColor(voucher.status)}
                        onClick={() => handleStatusChange(voucher.id)}
                        size="small"
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEdit(voucher)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(voucher.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalFilteredVouchers}
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

      {/* Modal Thêm/Chỉnh sửa Voucher */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher Mới'}
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
            <TextField
              label="Mã Voucher"
              name="code"
              variant="outlined"
              fullWidth
              value={modalFormData.code || ''}
              onChange={handleModalFormChange}
              required
            />
            <TextField
              label="Tên Voucher"
              name="name"
              variant="outlined"
              fullWidth
              value={modalFormData.name || ''}
              onChange={handleModalFormChange}
              required
            />
            <TextField
              label="Giá trị"
              name="value"
              variant="outlined"
              fullWidth
              type="number"
              value={modalFormData.value || 0}
              onChange={handleModalFormChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Loại (percentage/fixed_amount)"
              name="type"
              variant="outlined"
              fullWidth
              value={modalFormData.type || 'fixed_amount'}
              onChange={handleModalFormChange}
            // Trong thực tế, bạn sẽ dùng Select/Radio cho loại này
            />
            <TextField
              label="Ngày hết hạn"
              name="expiryDate"
              variant="outlined"
              fullWidth
              type="date"
              value={modalFormData.expiryDate || ''}
              onChange={handleModalFormChange}
              InputLabelProps={{
                shrink: true, // Để label không chồng lên giá trị khi có giá trị
              }}
              required
            />
            {/* Trạng thái có thể là Switch hoặc Select */}
            <FormControlLabel
              control={
                <Switch
                  checked={modalFormData.status === 'Active'}
                  onChange={(e) => setModalFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                  name="status"
                  color="primary"
                />
              }
              label={modalFormData.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveVoucher}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}