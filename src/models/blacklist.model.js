import mongoose from 'mongoose';

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, 'token is required to blacklist it'],
        },
    },
    {
        timestamps: true,
    },
);

const BlacklistTokenModel = mongoose.model('BlacklistTokenModel', blacklistTokenSchema);
export default BlacklistTokenModel;
