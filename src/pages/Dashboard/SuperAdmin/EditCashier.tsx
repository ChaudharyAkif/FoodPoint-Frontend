import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Spin, message } from "antd";
import axiosInstance from "../../../api/axiosInstance";
import { AxiosError } from "axios";

interface CashierFormValues {
  name: string;
  email: string;
  password?: string;
}

interface ErrorResponse {
  message?: string;
}

const EditCashier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCashier = async () => {
      if (!id) {
        message.error("Invalid cashier ID");
        return;
      }

      try {
        const res = await axiosInstance.get(`auth/cashiers/${id}`);
        if (res.data?.data) {
          form.setFieldsValue({
            name: res.data.data.name,
            email: res.data.data.email,
          });
        } else {
          message.error("Cashier not found");
        }
      } catch {
        message.error("Failed to fetch cashier");
      } finally {
        setLoading(false);
      }
    };

    fetchCashier();
  }, [id, form]);

  const handleSubmit = async (values: CashierFormValues) => {
    try {
      setSaving(true);

      const payload: CashierFormValues = {
        name: values.name,
        email: values.email,
      };

      if (values.password) {
        payload.password = values.password;
      }

      await axiosInstance.put(`/auth/cashiers/${id}`, payload);

      message.success("Cashier updated successfully");
      navigate("/dashboard/superadmin/cashiers");
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      message.error(error.response?.data?.message || "Failed to update cashier");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card
        title="Edit Cashier"
        className="w-full max-w-md rounded-xl shadow-lg"
        headStyle={{ borderBottom: "2px solid #f95300" }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter cashier name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="Enter cashier email" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="password"
            tooltip="Leave blank to keep current password"
          >
            <Input.Password placeholder="Leave blank to keep current" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            block
            style={{
              backgroundColor: "#f95300",
              borderColor: "#f95300",
              height: 42,
              fontWeight: 600,
            }}
          >
            Update Cashier
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditCashier;