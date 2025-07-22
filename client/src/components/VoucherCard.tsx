import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface VoucherDisplay {
    code_id: number;
    code: string;
    name: string;
    value: number;
    type: 'percentage' | 'fixed_amount';
    expiryDate: string;
    status: 'Active' | 'Inactive' | 'Expired';
}

interface VoucherCardProps {
    voucher: VoucherDisplay;
    onSaveVoucher: (voucherId: number) => void;
    isSaved: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onSaveVoucher, isSaved }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" fontWeight="bold">{voucher.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Mã: {voucher.code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Giá trị: {voucher.type === 'percentage' ? `${voucher.value}%` : `${voucher.value.toLocaleString()}₫`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            HSD: {new Date(voucher.expiryDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color={voucher.status === 'Active' ? 'green' : voucher.status === 'Expired' ? 'red' : 'orange'}>
                            Trạng thái: {voucher.status}
                        </Typography>
                    </Box>
                    <Button
                        variant={isSaved ? 'contained' : 'outlined'}
                        color="primary"
                        disabled={isSaved || voucher.status !== 'Active'}
                        onClick={() => onSaveVoucher(voucher.code_id)}
                    >
                        {isSaved ? 'Đã lưu' : 'Lưu mã'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VoucherCard;