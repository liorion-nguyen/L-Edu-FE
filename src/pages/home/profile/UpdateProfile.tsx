import React, { useEffect, useState } from "react";
import axios from "axios";
import { envConfig } from "../../../config";
import { UserType } from "../../../types/user";

type ProfileUpdatePayload = Partial<Omit<UserType, "_id" | "email" | "password" | "createdAt" | "updatedAt">>;

type UpdateProfileProps = {
  user: UserType;
  onSubmit: (updatedData: ProfileUpdatePayload) => Promise<void>;
};

type LocationItem = {
  id: string;
  name: string;
};

const inputClass =
  "w-full bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 px-3 py-2 text-sm " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none " +
  "placeholder:text-slate-400";

const UpdateProfile: React.FC<UpdateProfileProps> = ({ user, onSubmit }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [birthday, setBirthday] = useState<string>(() => {
    if (!user.birthday) return "";
    try {
      const d = new Date(user.birthday);
      if (Number.isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  });
  const [gender, setGender] = useState<string>(user.gender ?? "");
  const [bio, setBio] = useState<string>(user.bio ?? "");

  const [province, setProvince] = useState<string>(user.address?.province ?? "");
  const [district, setDistrict] = useState<string>(user.address?.district ?? "");
  const [ward, setWard] = useState<string>(user.address?.ward ?? "");

  const [country, setCountry] = useState<string>(user.phone?.country ?? "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phone?.number ?? "");
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const json = await response.json();
        setProvinces(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      setDistrict("");
      setWard("");
      return;
    }

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${province}.htm`);
        const json = await response.json();
        setDistricts(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [province]);

  useEffect(() => {
    if (!district) {
      setWards([]);
      setWard("");
      return;
    }

    const fetchWards = async () => {
      try {
        const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${district}.htm`);
        const json = await response.json();
        setWards(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setWards([]);
      }
    };

    fetchWards();
  }, [district]);

  useEffect(() => {
    if (!user.address?.province) return;

    const initialiseLocation = async () => {
      try {
        if (user.address?.province) {
          const districtRes = await fetch(`https://esgoo.net/api-tinhthanh/2/${user.address.province}.htm`);
          const districtJson = await districtRes.json();
          setDistricts(Array.isArray(districtJson?.data) ? districtJson.data : []);
        }
        if (user.address?.district) {
          const wardRes = await fetch(`https://esgoo.net/api-tinhthanh/3/${user.address.district}.htm`);
          const wardJson = await wardRes.json();
          setWards(Array.isArray(wardJson?.data) ? wardJson.data : []);
        }
      } catch (error) {
        // ignore silently
      }
    };

    initialiseLocation();
  }, [user.address?.district, user.address?.province]);

  const beforeUploadAvatar = (file: File): boolean => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Vui lòng chọn tệp hình ảnh");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      alert("Ảnh phải nhỏ hơn 5MB");
      return false;
    }
    return true;
  };

  const handleUploadAvatar = async (file: File) => {
    if (!file) return;
    try {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${envConfig.serverURL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data?.secure_url;
      if (!url) {
        throw new Error("Không nhận được đường dẫn ảnh");
      }
      setAvatarUrl(url);
      alert("Tải ảnh thành công");
    } catch (error: any) {
      alert(error?.message || "Tải ảnh thất bại");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const avatar = avatarUrl || undefined;
      const address = province && district && ward
        ? {
            province,
            district,
            ward,
          }
        : undefined;

      const phone = country || phoneNumber
        ? {
            country: country ?? "",
            number: phoneNumber ?? "",
          }
        : undefined;

      const payload: ProfileUpdatePayload = {
        fullName: fullName?.trim(),
        avatar,
        birthday: birthday ? new Date(birthday) : undefined,
        gender: gender || undefined,
        bio: bio?.trim() || undefined,
        address,
        phone,
      };

      Object.keys(payload).forEach((key) => {
        const typedKey = key as keyof ProfileUpdatePayload;
        if (payload[typedKey] === undefined || payload[typedKey] === null || payload[typedKey] === "") {
          delete payload[typedKey];
        }
      });

      await onSubmit(payload);
      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center gap-4">
        <div className="h-28 w-28 rounded-full overflow-hidden border border-slate-700 bg-slate-800/60 flex items-center justify-center">
          {avatarUrl ? (
            <img alt="" src={avatarUrl} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-slate-300 text-5xl">person</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={avatarUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!beforeUploadAvatar(file)) return;
                await handleUploadAvatar(file);
                e.currentTarget.value = "";
              }}
            />
            <span className="profile-upload-btn inline-flex items-center justify-center bg-primary hover:bg-[#006fe6] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all">
              {avatarUploading ? "Đang tải..." : "Tải ảnh lên"}
            </span>
          </label>
          <p className="text-xs text-slate-400">Chỉ chấp nhận ảnh JPG, JPEG, PNG dưới 5MB.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Họ và tên</label>
        <input className={inputClass} type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Ngày sinh</label>
          <input className={inputClass} type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Giới tính</label>
          <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Tiểu sử</label>
        <textarea
          className={inputClass + " min-h-[100px] resize-none"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Chia sẻ đôi nét về bạn..."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tỉnh/Thành phố</label>
          <select className={inputClass} value={province} onChange={(e) => setProvince(e.target.value)} required>
            <option value="">{provinces.length ? "Chọn tỉnh" : "Đang tải..."}</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Quận/Huyện</label>
          <select
            className={inputClass}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!province}
            required
          >
            <option value="">{!province ? "Chọn tỉnh trước" : districts.length ? "Chọn quận" : "Đang tải..."}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Phường/Xã</label>
          <select className={inputClass} value={ward} onChange={(e) => setWard(e.target.value)} disabled={!district} required>
            <option value="">{!district ? "Chọn quận trước" : wards.length ? "Chọn phường" : "Đang tải..."}</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Mã quốc gia</label>
          <input className={inputClass} type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="+84" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Số điện thoại</label>
          <input
            className={inputClass}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="000000000"
            pattern="^\\d{8,11}$"
            required
          />
          <p className="text-xs text-slate-400">Số điện thoại phải từ 8 đến 11 chữ số.</p>
        </div>
      </div>

      <button
        type="submit"
        className="profile-submit-btn w-full bg-primary hover:bg-[#006fe6] text-white px-5 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all"
      >
        Lưu thay đổi
      </button>
    </form>
  );
};

export default UpdateProfile;