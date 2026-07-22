package com.shopstack.modules.auth.config;

import com.shopstack.common.enums.AccountStatus;
import com.shopstack.common.enums.Gender;
import com.shopstack.modules.user.entity.Role;
import com.shopstack.modules.user.entity.User;
import com.shopstack.modules.user.repository.RoleRepository;
import com.shopstack.modules.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2) // runs after RoleSeeder (Order(1)), so the VENDOR role already exists
public class VendorAccountSeeder implements CommandLineRunner {

    private static final String SAMPLE_EMAIL = "vendor.test@shopstack.local";
    private static final String SAMPLE_PASSWORD = "VendorTest123!";
    private static final long SAMPLE_PHONE = 9000000001L;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public VendorAccountSeeder(UserRepository userRepository,
                                RoleRepository roleRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(SAMPLE_EMAIL).isPresent()) {
            return; // already seeded
        }

        Role vendorRole = roleRepository.findByName("VENDOR")
                .orElseThrow(() -> new IllegalStateException(
                        "VENDOR role not found — RoleSeeder must run before VendorAccountSeeder"));

        User vendor = User.builder()
                .firstName("Test")
                .lastName("Vendor")
                .name("Test Vendor")
                .email(SAMPLE_EMAIL)
                .password(passwordEncoder.encode(SAMPLE_PASSWORD))
                .phone(SAMPLE_PHONE)
                .gender(Gender.OTHER)
                .status(AccountStatus.ACTIVE)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(true)
                .role(vendorRole)
                .build();

        userRepository.save(vendor);

        System.out.println("=================================================");
        System.out.println("Sample vendor account seeded:");
        System.out.println("  email:    " + SAMPLE_EMAIL);
        System.out.println("  password: " + SAMPLE_PASSWORD);
        System.out.println("=================================================");
    }
}