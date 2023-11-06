import { RoleAccessGuard } from './role-access.guard';

describe('RoleAccessGuard', () => {
  it('should be defined', () => {
    expect(new RoleAccessGuard()).toBeDefined();
  });
});
