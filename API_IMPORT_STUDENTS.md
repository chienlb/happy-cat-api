# 📊 API IMPORT SINH VIÊN TỪ EXCEL

## Mô tả tính năng

Cho phép giáo viên upload file Excel để tạo nhanh tài khoản cho nhiều sinh viên cùng lúc, thay vì tạo từng cái một.

## Endpoint

```http
POST /api/v1/users/import-from-excel
Content-Type: multipart/form-data
Authorization: Bearer <ACCESS_TOKEN>
```

## Yêu cầu

- **Role**: ADMIN hoặc TEACHER
- **File**: Excel (.xlsx, .xls, hoặc .csv)
- **GroupId**: ID của lớp/nhóm để thêm sinh viên vào

## Định dạng File Excel

### Columns bắt buộc:

| Tên Cột | Kiểu | Mô tả | Ví dụ |
|---------|------|-------|--------|
| fullname | String | Họ và tên sinh viên | Nguyễn Văn A |
| email | Email | Email (phải unique) | nguyenan@gmail.com |
| birthDate | Date | Ngày sinh (YYYY-MM-DD) | 2010-05-15 |
| gender | Enum | Giới tính (MALE\|FEMALE\|OTHER) | MALE |

### Columns tùy chọn:

| Tên Cột | Kiểu | Mô tả |
|---------|------|-------|
| phone | String | Số điện thoại |

### Ví dụ file Excel:

```
fullname          | email               | birthDate    | gender | phone
Nguyễn Văn A      | nguyenan@gmail.com  | 2010-05-15   | MALE   | 0912345678
Trần Thị B        | tranthib@gmail.com  | 2011-03-20   | FEMALE | 0987654321
Lê Văn C          | levanc@gmail.com    | 2009-07-10   | MALE   |
Phạm Thị D        | phamthid@gmail.com  | 2010-12-01   | FEMALE | 0898765432
```

## Request Parameters

### Form Data:

```javascript
{
  "file": <binary>,              // Excel file (bắt buộc)
  "groupId": "507f1f77bcf86cd799439011",  // ID của group (bắt buộc)
  "autoEnroll": true,            // Tự động thêm vào group (mặc định: true)
  "sendInviteEmail": true,       // Gửi email mời (mặc định: true)
  "autoPassword": "Abc@123456"   // Password chung cho tất cả (nếu không, tạo random)
}
```

## Cách sử dụng

### Với cURL:

```bash
curl -X POST http://localhost:3000/api/v1/users/import-from-excel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@students.xlsx" \
  -F "groupId=507f1f77bcf86cd799439011" \
  -F "autoEnroll=true" \
  -F "sendInviteEmail=true"
```

### Với Postman:

1. **Method**: POST
2. **URL**: `http://localhost:3000/api/v1/users/import-from-excel`
3. **Headers**:
   - `Authorization`: Bearer YOUR_TOKEN
4. **Body** (form-data):
   - Key: `file`, Value: Chọn file Excel
   - Key: `groupId`, Value: `507f1f77bcf86cd799439011`
   - Key: `autoEnroll`, Value: `true`
   - Key: `sendInviteEmail`, Value: `true`

### Với JavaScript/Fetch:

```javascript
const formData = new FormData();
formData.append('file', excelFile); // File object từ input
formData.append('groupId', 'GROUP_ID');
formData.append('autoEnroll', 'true');
formData.append('sendInviteEmail', 'true');

const response = await fetch('/api/v1/users/import-from-excel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

### Với axios:

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', excelFile);
formData.append('groupId', 'GROUP_ID');
formData.append('autoEnroll', 'true');
formData.append('sendInviteEmail', 'true');

const response = await axios.post('/api/v1/users/import-from-excel', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

console.log(response.data);
```

## Response Success (201)

```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Import completed: 3 students created, 1 failed, 1 skipped",
  "data": {
    "success": 3,
    "failed": 1,
    "skipped": 1,
    "total": 5,
    "message": "Import completed: 3 students created, 1 failed, 1 skipped",
    "details": [
      {
        "row": 2,
        "email": "nguyenan@gmail.com",
        "fullname": "Nguyễn Văn A",
        "status": "SUCCESS",
        "userId": "507f1f77bcf86cd799439012",
        "generatedPassword": "aB3$cDeFgHiJ"
      },
      {
        "row": 3,
        "email": "tranthib@gmail.com",
        "fullname": "Trần Thị B",
        "status": "SUCCESS",
        "userId": "507f1f77bcf86cd799439013",
        "generatedPassword": "xY9@zAbCdEfG"
      },
      {
        "row": 4,
        "email": "levanc@gmail.com",
        "fullname": "Lê Văn C",
        "status": "FAILED",
        "reason": "Invalid birthDate format"
      },
      {
        "row": 5,
        "email": "phamthid@gmail.com",
        "fullname": "Phạm Thị D",
        "status": "SKIPPED",
        "reason": "Email already exists (User ID: 507f1f77bcf86cd799439014)"
      },
      {
        "row": 6,
        "email": "duplicate@gmail.com",
        "status": "FAILED",
        "reason": "Email must be a valid email"
      }
    ]
  }
}
```

## Response Errors

### 400 - Bad Request (File không hợp lệ)

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Invalid file format. Allowed formats: .xlsx, .xls, .csv",
  "error": "Bad Request"
}
```

### 400 - Bad Request (Excel trống)

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Excel file is empty",
  "error": "Bad Request"
}
```

### 401 - Unauthorized

```json
{
  "status": "error",
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 - Forbidden (Không có quyền)

```json
{
  "status": "error",
  "statusCode": 403,
  "message": "You do not have permission to add students to this group",
  "error": "Forbidden"
}
```

### 404 - Not Found (Group không tồn tại)

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Group not found",
  "error": "Not Found"
}
```

### 500 - Internal Server Error

```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Quy tắc xử lý dữ liệu

### 1. Validation

- **Email**: Phải là định dạng email hợp lệ
- **birthDate**: Phải là định dạng YYYY-MM-DD
- **gender**: Phải là MALE, FEMALE hoặc OTHER
- **fullname**: Bắt buộc, min 2 ký tự
- **phone**: Tùy chọn, nếu có phải là số điện thoại hợp lệ

### 2. Duplicate Handling

- Nếu email đã tồn tại trong hệ thống:
  - Status: `SKIPPED`
  - Reason: "Email already exists (User ID: xxx)"
  - Không tạo tài khoản mới

### 3. Account Creation

- Username: Tự động generate từ phần đầu email (vd: "nguyenan")
  - Nếu duplicate, thêm số (vd: "nguyenan1", "nguyenan2")
- Password:
  - Nếu `autoPassword` được cung cấp: sử dụng password đó
  - Nếu không: generate random 12 ký tự (chứa chữ hoa, chữ thường, số, ký tự đặc biệt)
- Role: Tự động set là `STUDENT`
- Status: Tự động set là `ACTIVE`

### 4. Group Enrollment

- Nếu `autoEnroll = true`: Tự động thêm sinh viên vào group
- Nếu `autoEnroll = false`: Chỉ tạo tài khoản, không thêm vào group

### 5. Email Notification

- Nếu `sendInviteEmail = true`: Gửi email chào mừng với thông tin đăng nhập
- Email template: Tên sinh viên, username, password, tên group, link đăng nhập

## Tính năng bổ sung (Future)

```javascript
// TODO: Features to implement
- Download template Excel
- Preview dữ liệu trước khi import
- Batch processing cho file lớn (>1000 rows)
- Scheduled import (import lúc định thời gian)
- Import history & audit log
- Rollback nếu có lỗi (transaction)
- Thêm quyền/role cho từng sinh viên
- Set subscription package cho batch
- Map custom columns
```

## Quy trình xử lý

```
User submit file + groupId
            ↓
Parse Excel file
            ↓
Validate group exists
            ↓
Check teacher permission
            ↓
For each row:
  ├── Validate dữ liệu
  ├── Check email exists?
  ├── Generate username & password
  ├── Create user
  ├── Add to group (if autoEnroll)
  ├── Send email (if sendInviteEmail)
  └── Record result (SUCCESS/FAILED/SKIPPED)
            ↓
Commit transaction
            ↓
Return import result
```

## Best Practices

1. **Validate file trước khi upload**
   - Kiểm tra format Excel
   - Kiểm tra columns bắt buộc
   - Preview data

2. **Xử lý lỗi gracefully**
   - Continue processing even if some rows fail
   - Provide detailed error messages
   - Allow retry

3. **Security**
   - HTTPS only
   - Verify JWT token
   - Check role & permission
   - Validate file content

4. **Performance**
   - Use batch processing cho file lớn
   - Database transaction để rollback nếu fail
   - Log detailed information

5. **UX**
   - Show progress bar (frontend)
   - Download result report (CSV)
   - Allow undo (within 24 hours)

## Ví dụ Frontend Component

```react
import { useState } from 'react';
import axios from 'axios';

export function StudentImportForm({ groupId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && /\.(xlsx?|csv)$/.test(selectedFile.name)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid Excel file (.xlsx, .xls, or .csv)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);
    formData.append('autoEnroll', true);
    formData.append('sendInviteEmail', true);

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/users/import-from-excel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-form">
      <form onSubmit={handleSubmit}>
        <label>
          Select Excel File:
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Importing...' : 'Import Students'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Import Result</h3>
          <p>
            Success: {result.success} | Failed: {result.failed} |
            Skipped: {result.skipped}
          </p>

          {result.details.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {result.details.map((detail, idx) => (
                  <tr key={idx}>
                    <td>{detail.row}</td>
                    <td>{detail.email}</td>
                    <td>{detail.status}</td>
                    <td>
                      {detail.status === 'SUCCESS'
                        ? `Password: ${detail.generatedPassword}`
                        : detail.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Q: "Invalid file format"
A: Chắc chắn file là .xlsx, .xls hoặc .csv

### Q: "Excel file is empty"
A: File không có dữ liệu hoặc các cột không có tên

### Q: "No data found"
A: File không có rows hoặc sheet name khác mong đợi

### Q: "Email already exists"
A: Email đó đã được sử dụng, kiểm tra lại trong hệ thống

### Q: "You do not have permission"
A: Teacher chỉ có thể add sinh viên vào group của chính họ

---

**Tài liệu này được cập nhật lần cuối: 28/01/2026**
