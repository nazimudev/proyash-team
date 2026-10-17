import MembershipField from "@/components/membership/MembershipField";
import ProfilePhotoUpload from "@/components/membership/ProfilePhotoUpload";
import { personalFields } from "@/data/membership";

export default function PersonalInformationForm({ values, errors, onChange, photo, photoError, onPhotoSelect, onPhotoRemove }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {personalFields.map((def) => (
          <MembershipField key={def.name} def={def} value={values[def.name]} onChange={onChange} error={errors[def.name]} />
        ))}
      </div>
      <ProfilePhotoUpload photo={photo} error={photoError} onSelect={onPhotoSelect} onRemove={onPhotoRemove} />
    </div>
  );
}
