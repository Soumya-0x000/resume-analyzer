import mongoose from 'mongoose';

const blacklistTokenSchema = new mongoose.Schema(
    { token: { type: String, required: [true, 'token is required to blacklist it'] } },
    { timestamps: true },
);

blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const BlacklistTokenModel = mongoose.model('blacklistToken', blacklistTokenSchema);
export default BlacklistTokenModel;
