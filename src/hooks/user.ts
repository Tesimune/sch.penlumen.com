import { axiosInstance } from '@/lib/axios';

export const useUser = () => {
  const index = async (role: string) => {
    const response = await axiosInstance.get(
      `/api/v1/user/index?role=${role.toUpperCase()}`
    );
    const data = response.data;

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
      };
    } else {
      return {
        success: true,
        data: data.data,
      };
    }
  };

  const show = async (uuid: string) => {
    const response = await axiosInstance.get(`/api/v1/user/show/${uuid}`);
    const data = response.data;
    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
      };
    } else {
      return {
        success: true,
        data: data.data,
      };
    }
  };

  const create = async (userData: any) => {
    const response = await axiosInstance.post('/api/v1/user/create', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      contact: userData.contact,
      alt_contact: userData.alt_contact,
      position: userData.position,
      address: userData.address,
      role: userData.role,
    });
    const data = response.data;

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
        data: data.data,
      };
    } else {
      return {
        success: true,
        data: data.data,
      };
    }
  };

  const update = async (uuid: string | null, userData: any) => {
    if (!uuid) {
      return {
        success: false,
        message: 'UUID is required for updating user',
      };
    }
    const response = await axiosInstance.patch(`/api/v1/user/update/${uuid}`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      contact: userData.contact,
      alt_contact: userData.alt_contact,
      position: userData.position,
      address: userData.address,
    });
    const data = response.data;

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
        data: data.data,
      };
    } else {
      return {
        success: true,
        data: data.data,
      };
    }
  };

  const remove = async (uuid: string) => {
    const response = await axiosInstance.delete(`/api/v1/user/delete/${uuid}`);

    return {
      success: response.data.success,
      message: response.data.message || 'Something went wrong',
    };
  };

  return {
    show,
    index,
    create,
    update,
    remove,
  };
};
