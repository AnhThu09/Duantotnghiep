import { Box, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface CustomerFormProps {
  onFormChange?: (data: any) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onFormChange = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    notes: '',
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Fetch provinces on mount
  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error('Lỗi lấy danh sách tỉnh/thành:', err));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!formData.province) return;

    const selectedProvince = provinces.find(p => p.name === formData.province);
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then(res => {
          setDistricts(res.data.districts);
          setWards([]);
          handleChange('district', '');
          handleChange('ward', '');
        });
    }
  }, [formData.province]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!formData.district) return;

    const selectedDistrict = districts.find(d => d.name === formData.district);
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then(res => {
          setWards(res.data.wards);
          handleChange('ward', '');
        });
    }
  }, [formData.district]);

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormChange(newData);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Thông tin nhận hàng
        </Typography>

        <Box sx={{ mt: 3 }}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Họ tên"
                placeholder="Nhập họ tên của bạn"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <TextField
                fullWidth
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="Để lại email để nhận thông tin đơn hàng"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                label="Địa chỉ"
                placeholder="Địa chỉ (Ví dụ: 123 Hoàng Cầu)"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
              />
            </div>

            <div className="col-12 col-md-4">
              <TextField
                select
                fullWidth
                label="Tỉnh/thành phố"
                value={formData.province}
                onChange={e => handleChange('province', e.target.value)}
              >
                <MenuItem value="">Chọn Tỉnh/thành phố</MenuItem>
                {provinces.map(p => (
                  <MenuItem key={p.code} value={p.name}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="col-12 col-md-4">
              <TextField
                select
                fullWidth
                label="Quận/huyện"
                value={formData.district}
                onChange={e => handleChange('district', e.target.value)}
                disabled={!districts.length}
              >
                <MenuItem value="">Chọn Quận/huyện</MenuItem>
                {districts.map(d => (
                  <MenuItem key={d.code} value={d.name}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="col-12 col-md-4">
              <TextField
                select
                fullWidth
                label="Phường/xã"
                value={formData.ward}
                onChange={e => handleChange('ward', e.target.value)}
                disabled={!wards.length}
              >
                <MenuItem value="">Chọn Phường/xã</MenuItem>
                {wards.map(w => (
                  <MenuItem key={w.code} value={w.name}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú thêm"
                placeholder="Ghi chú thêm (Ví dụ: Giao giờ hành chính)"
                value={formData.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
