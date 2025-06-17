import React, { useState, useEffect, useMemo, useCallback } from 'react';

import {
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  Switch,
  FormControlLabel,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close'; // Icon đóng modal

// --- MOCK DATA & INTERFACES ---
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
  status: 'Active' | 'Inactive';
}

const initialUsers: User[] = [
  { id: 'U001', name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'Admin', status: 'Active' },
  { id: 'U002', name: 'Trần Thị B', email: 'thib@example.com', role: 'User', status: 'Active' },
  { id: 'U003', name: 'Lê Văn C', email: 'vanc@example.com', role: 'Editor', status: 'Inactive' },
  { id: 'U004', name: 'Phạm Thị D', email: 'thid@example.com', role: 'User', status: 'Active' },
  { id: 'U005', name: 'Hoàng Văn E', email: 'vane@example.com', role: 'User', status: 'Inactive' },

];

type Order = 'asc' | 'desc';
type HeadCellId = keyof User; // Các key trong User interface có thể sắp xếp

interface HeadCell {
  id: HeadCellId;
  label: string;
  numeric: boolean;
  disableSorting?: boolean;
}

const headCells: HeadCell[] = [
  { id: 'id', numeric: false, label: 'ID Người Dùng' },
  { id: 'name', numeric: false, label: 'Tên Người Dùng' },
  { id: 'email', numeric: false, label: 'Email' },
  { id: 'role', numeric: false, label: 'Vai trò' },
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

function getComparator<Key extends PropertyKey>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Hàm ổn định việc sắp xếp (để giữ nguyên thứ tự các phần tử bằng nhau)
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

// --- USER MANAGER COMPONENT ---
export default function UserManager() {
  const theme = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // 5 users per page

  // State cho sắp xếp
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<HeadCellId>('id');

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>('');

  // State cho Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // Null khi thêm mới, User object khi chỉnh sửa

  // --- MOCK API CALL ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers(initialUsers); // Load mock data
      } catch (err) {
        setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // Chỉ chạy một lần khi component mount

  // --- HANDLERS ---

  // Xử lý thay đổi trang
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  // Xử lý thay đổi số lượng hàng trên mỗi trang
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Về trang đầu tiên khi thay đổi số lượng hàng
  }, []);

  // Xử lý sắp xếp
  const handleRequestSort = useCallback((event: React.MouseEvent<unknown>, property: HeadCellId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  // Xử lý tìm kiếm
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset về trang đầu tiên khi tìm kiếm
  }, []);

  // Xử lý khi thay đổi trạng thái Switch
  const handleStatusChange = useCallback((userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      )
    );
  }, []);

  // Mở modal Thêm người dùng
  const handleAddNewUser = useCallback(() => {
    setEditingUser(null); // Đặt null để báo hiệu là thêm mới
    setIsModalOpen(true);
  }, []);

  // Mở modal Chỉnh sửa người dùng
  const handleEdit = useCallback((user: User) => {
    setEditingUser(user); // Đặt đối tượng người dùng để chỉnh sửa
    setIsModalOpen(true);
  }, []);

  // Xử lý xóa người dùng
  const handleDelete = useCallback((userId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${userId}?`)) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      // Trong thực tế: Gửi request xóa đến API
      console.log(`Đã xóa người dùng với ID: ${userId}`);
    }
  }, []);

  // Đóng modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null); // Reset lại
  }, []);

  // Xử lý lưu người dùng từ modal (ví dụ)
  const handleSaveUser = useCallback((userData: User) => {
    if (editingUser) {
      // Logic cập nhật người dùng hiện có
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userData.id ? userData : user))
      );
      console.log('Cập nhật người dùng:', userData);
    } else {
      // Logic thêm người dùng mới
      const newId = `U${String(users.length + 1).padStart(3, '0')}`; // ID tự động
      const newUser = { ...userData, id: newId };
      setUsers((prevUsers) => [...prevUsers, newUser]);
      console.log('Thêm người dùng mới:', newUser);
    }
    handleCloseModal();
  }, [editingUser, users, handleCloseModal]);

  // --- MEMOIZED DATA FOR TABLE ---
  const filteredAndSortedUsers = useMemo(() => {
    let currentUsers = users;

    // 1. Lọc theo tìm kiếm
    if (searchTerm) {
      currentUsers = currentUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sắp xếp
    currentUsers = stableSort(currentUsers, getComparator(order, orderBy));

    // 3. Phân trang
    const startIndex = page * rowsPerPage;
    return currentUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [users, searchTerm, order, orderBy, page, rowsPerPage]);

  const totalFilteredUsers = useMemo(() => {
    let currentUsers = users;
    if (searchTerm) {
      currentUsers = currentUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return currentUsers.length;
  }, [users, searchTerm]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
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
        Quản Lý Người Dùng
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3], mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
          <TextField
            label="Tìm kiếm người dùng..."
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
            onClick={handleAddNewUser}
            sx={{ flexShrink: 0 }}
          >
            Thêm Người Dùng Mới
          </Button>
        </Box>

        <TableContainer>
          <Table aria-label="user management table">
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
              {filteredAndSortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Không tìm thấy người dùng nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.status === 'Active'}
                            onChange={() => handleStatusChange(user.id)}
                            name="userStatus"
                            color={user.status === 'Active' ? 'success' : 'error'} // Màu sắc theo trạng thái
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{
                              color: user.status === 'Active' ? theme.palette.success.main : theme.palette.error.main,
                              fontWeight: 'medium',
                            }}
                          >
                            {user.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                          </Typography>
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEdit(user)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(user.id)}
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

        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Tùy chọn số lượng hàng trên mỗi trang
          component="div"
          count={totalFilteredUsers}
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

      {/* Modal Thêm/Chỉnh sửa người dùng */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới'}
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
          {/* Đây sẽ là nơi chứa Form để thêm/chỉnh sửa người dùng */}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên Người Dùng"
              variant="outlined"
              fullWidth
              defaultValue={editingUser?.name || ''}
              // Trong thực tế, bạn sẽ dùng state để quản lý giá trị input
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              defaultValue={editingUser?.email || ''}
            />
            {/* Thêm các trường khác như Vai trò, Trạng thái (dropdown/radio group) */}
            <TextField
              label="Vai trò (Admin/User/Editor)"
              variant="outlined"
              fullWidth
              defaultValue={editingUser?.role || 'User'}
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
            onClick={() => handleSaveUser({ /* Dữ liệu từ form */ } as User)} // Cần lấy dữ liệu từ các TextField thực tế
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}