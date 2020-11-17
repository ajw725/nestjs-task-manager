import { hash } from 'bcryptjs';
import { User } from './user.entity';

describe('User', () => {
  describe('validatePassword', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      user.password = 'hashedpassword';
      user.salt = 'salt';
    });

    it('returns true when valid', async () => {
      const isValid = await user.validatePassword('whatever');
      expect(isValid).toBe(true);
    });

    it('returns false when invalid', async () => {
      user.password = 'wrong';
      const isValid = await user.validatePassword('whatever');
      expect(isValid).toBe(false);
    });

    it('hashes and salts with bcrypt', async () => {
      await user.validatePassword('whatever');
      expect(hash as jest.Mock).toHaveBeenCalledWith('whatever', 'salt');
    });
  });
});
